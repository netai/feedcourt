var usersModel = require('../models/usersModel');
var tokenHelper = require('../helpers/token');

module.exports = {
  // GET /
  home: function(req, res, next){
    res.render('api/home',{});
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
          console.log(error);
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

  },
};
