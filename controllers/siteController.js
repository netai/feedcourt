var usersModel = require('../models/usersModel');
var statesModel = require('../models/statesModel');
var citiesModel = require('../models/citiesModel');

module.exports = {
  // GET /
  dashboard: function(req, res, next){
    res.render('site/dashboard',{});
  },
  // ALL /portal/login
  portal_login: function(req, res, next) {
    var sess = req.session;
    if(sess.is_login){
      res.redirect('/portal');
    } else {
        if(req.method == 'POST'){
        var email = req.body.email;
        var password = req.body.password;
        usersModel.forge({email: email,password: password})
        .fetch()
        .then(function (model) {
          if(model){
            sess.user_id = model.id;
            sess.user_type = model.get('user_type');
            sess.name = model.get('full_name');
            sess.email = model.get('email');
            sess.is_login = true;
            res.redirect('/portal');
          } else {
            var context = {
              error: 'Wrong email/password',
              sess: req.session
            };
            res.render('site/login', context);
          }
        })
        .catch(function (error) {
          console.log(error.message);
          res.redirect('/portal/login');
        });
      } else {
        res.render('site/login', {error:''});
      }
    }

  },
  // ALL /portal/changepassword
  change_password: function(req, res, next) {
        if(req.method == 'POST'){
          var sess = req.session;
        var opassword = req.body.opassword;
        var npassword = req.body.npassword;
        usersModel.forge({password: opassword,id: sess.user_id})
        .fetch()
        .then(function (model) {
          if(model){
            model.save({password: npassword})
            .then(function(){
              res.redirect('/portal/changepassword');
            })
            .catch(function(error){
              console.log(error.message);
              res.redirect('/portal');
            });
          } else {
            var context = {
              error: 'Wrong Old Password'
            };
            res.render('site/change_password', context);
          }
        })
        .catch(function (error) {
          console.log(error.message);
          res.redirect('/portal');
        });
      } else {
        res.render('site/change_password', {error:''});
      }

  },
  //GET /portal/logout
  portal_logout: function(req, res, next){
    req.session.destroy();
    res.redirect('/portal/login');
  },
  // GET /StateList/
  state_list: function(req, res, next){
    statesModel.fetchAll()
    .then(function (model) {
      var context = {};
      if(model){
        context = {
          state: model.toJSON(),
        };
      } else {
        context = {
          state: {},
        };
      }
      res.json(context);
    })
    .catch(function (error) {
      var context = {
          state: {},
          message: error.message,
          status: 'error',
        };
        res.json(context);
    });
  },
  // GET /Cities/
  city_list: function(req, res, next){
    var id=req.params.id;
    citiesModel.where({state_id:id})
    .fetchAll()
    .then(function (model) {
      var context = {};
      if(model){
        context = {
          city: model.toJSON(),
        };
      } else {
        context = {
          city: {},
        };
      }
      res.json(context);
    })
    .catch(function (error) {
      var context = {
          city: {},
          message: error.message,
          status: 'error',
        };
        res.json(context);
    });
  },
  // GET /Foodcourt List/
  foodcourt_list: function(req, res, next){
    //var id=req.params.id;
    usersModel.where({status:'1',user_type:'2'}) 
    .fetchAll({columns:['id','full_name']})
    .then(function (model) {
      var context = {};
      if(model){
        context = {
          foodcourt: model.toJSON(),
        };
      } else {
        context = {
          foodcourt: {},
        };
      }
      res.json(context);
    })
    .catch(function (error) {
      var context = {
          foodcourt: {},
          message: error.message,
          status: 'error',
        };
        res.json(context);
    });
  },
    // GET /emailexist/
  email_exist: function(req, res, next){
    var email=req.body.email;
    usersModel.where({email:email})
    .fetch()
    .then(function (model) {
      var context = {};
      if(model){
        context = {
          message: 'email exist',
          status: true
        };
      } else {
        context = {
          message: 'email not exist',
          status: false
        };
      }
      res.json(context);
    })
    .catch(function (error) {
      var context = {
          city: {},
          message: error.message,
          status: 'error',
        };
        res.json(context);
    });
  },
};
