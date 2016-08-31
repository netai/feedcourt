var usersModel = require('../models/usersModel'),
    statesModel = require('../models/statesModel'),
    foodcourtsModel = require('../models/foodcourtsModel'),
    restaurantsModel = require('../models/restaurantsModel'),
    citiesModel = require('../models/citiesModel');
var tokenHelper = require('../helpers/token');

module.exports = {
  // GET /
  v1_home: function(req, res, next){
    res.render('api/v1_home',{});
  },
  // POST /login
  login: function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var user_type= 4; //customer type
    usersModel.forge({email: email,password: password,user_type:user_type, facebook_id:0})
    .fetch()
    .then(function (model) {
      var response = {};

      if(model){
        if(model.get('status')==1){
          response = {
            data: {
              id: model.id,
              name: model.get('full_name'),
              email: model.get('email'),
              phone: model.get('phone_no'),
            },
            token: tokenHelper.createToken(model),
            status: 'success',
          };
        } else {
          response = {
            message: 'user blocked by admin',
            status: 'error',
            code: '2002'
          };
        }
      } else {
        response = {
          message: 'user not exist',
          status: 'error',
          code: '2001'
        };
      }
      
      res.json(response);
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});
    });
  },
  
  // POST /signup
  signup: function(req, res, next) {
    var req_data = {
      email : req.body.email,
      password : req.body.password,
      full_name : req.body.name,
      phone_no : req.body.phone,
      status : 1
    }
    var response = {};
    usersModel.forge({email: req_data.email, facebook_id:0})
    .fetch()
    .then(function (model) {
      if(model){
        response = {
          message: 'email id exist',
          status: 'error',
          code: '2004'
        };
        
        res.json(response);
      } else {
        usersModel.forge(req_data)
        .save()
        .then(function (model) {
          
          if(model){
              response = {
                data: {
                  id: model.id,
                  name: model.get('full_name'),
                  email: model.get('email'),
                  phone: model.get('phone_no'),
                },
                token: tokenHelper.createToken(model),
                status: 'success',
              };
          } else {
            response = {
              message: 'signup problem',
              status: 'error',
              code: '2003'
            };
          }
          
          res.json(response);
        })
        .catch(function (error) {
          res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});
        });
      }
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});
    });
  },
  
  // POST /facebook_signup
  facebook_signup: function(req, res, next) {
    var req_data = {
      email : req.body.email,
      password : req.body.facebook_id,
      full_name : req.body.name,
      phone_no : req.body.phone,
      facebook_id: req.body.facebook_id,
      status : 1
    }
    var response = {};
    usersModel.forge({facebook_id: req_data.facebook_id})
    .fetch()
    .then(function (model) {
      if(model){
          response = {
            data: {
              id: model.id,
              name: model.get('full_name'),
              email: model.get('email'),
              phone: model.get('phone_no'),
            },
            token: tokenHelper.createToken(model),
            status: 'success',
          };
        
        res.json(response);
      } else {
        usersModel.forge(req_data)
        .save()
        .then(function (model) {
          
          if(model){
              response = {
                data: {
                  id: model.id,
                  name: model.get('full_name'),
                  email: model.get('email'),
                  phone: model.get('phone_no'),
                },
                token: tokenHelper.createToken(model),
                status: 'success',
              };
          } else {
            response = {
              message: 'facebook signup problem',
              status: 'error',
              code: '2005'
            };
          }
          
          res.json(response);
        })
        .catch(function (error) {
          console.log(error);
          res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});
        });
      }
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});
    });
  },
  
  // POST /search
  search: function(req, res, next) {
    var q = req.body.q;
    var city_id=parseInt(req.body.city_id);
    foodcourtsModel.query(function(qb) {
      qb.innerJoin('addresses', function () {
        this.on('users.id', '=', 'addresses.user_id')
        .andOn('addresses.city_id', '=', city_id);
      })
    })
    .orderBy('id','desc')
    .where({user_type:2, 'users.status':1})
    .where('full_name', 'LIKE', '%'+q+'%')
    .fetchAll({withRelated: ['addresses','addresses.state','addresses.city',{images: function(query) { query.where({'type':'1'}); }}]})
    .then(function (foodcourts_model) {
      restaurantsModel.query('orderBy', 'id', 'desc').where({'user_type':'3','status': 1}).where('full_name', 'LIKE', '%'+q+'%')
      .fetchAll({withRelated: ['addresses','addresses.state','addresses.city',{images: function(query) { query.where({'type':'1','is_default':1}); }}]})
      .then(function (restaurants_model) {
        var response = {
          foodcourts: foodcourts_model.toJSON(),
          restaurants: restaurants_model.toJSON(),
          status: 'success'
        };
        res.json(response);
      })
      .catch(function (error) {
        res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});
      });
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});
    });
  },
  
  // GET /states/:id/cities
  city_list: function(req, res, next){
    var id=req.params.id;
    citiesModel.where({state_id:id})
    .fetchAll()
    .then(function (model) {
      var response = {
        cities: model.toJSON(),
        status: 'success'
      };
      res.json(response);
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});
    });
  },
  
  // GET /states/
  state_list: function(req, res, next){
    statesModel.fetchAll()
    .then(function (model) {
      var response = {
        states: model.toJSON(),
        status: 'success'
      };
      res.json(response);
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});
    });
  },
};
