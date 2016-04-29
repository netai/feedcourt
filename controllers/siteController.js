var usersModel = require('../models/usersModel');
var tokenHelper = require('../helpers/token');

module.exports = {
  // GET /
  home: function(req, res, next){
    res.render('outter_layout',{});
  },
  // POST /login
  login: function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var user_type=req.body.user_type;
    usersModel.forge({email: email,password: password})
    .fetch()
    .then(function (model) {
      response = {};

      if(model){
        response = {
          data: {
            id: model.id,
            user_type: model.get('user_type'),
            name: model.get('full_name'),
            email: model.get('email'),
          },
          token: tokenHelper.createToken(model),
          message: 'login successfull',
          status: 'success',
          code: '1001'
        };
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
      res.status(500).json({msg: error.message,code: 'SYSERR'});
    });
  },
  // POST / adminlogin
  adminlogin: function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var user_type=req.body.user_type;
    usersModel.forge({email: email,password: password})
    .fetch()
    .then(function (model) {
      response = {};

      if(model){
        if(model.get('user_type')==1 || model.get('user_type')==2){
          response = {
            data: {
              id: model.id,
              user_type: model.get('user_type'),
              name: model.get('full_name'),
              email: model.get('email'),
            },
            token: tokenHelper.createToken(model),
            message: 'login successfull',
            status: 'success',
            code: '1001'
          };
        } else {
          response = {
            message: 'unauthoriz access',
            status: 'error',
            code: '2001'
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
      res.status(500).json({msg: error.message,code: 'SYSERR'});
    });
  },
  // POST /signup
  signup: function(req, res, next) {
    usersModel.forge(req.body)
    .save()
    .then(function (model) {
      res.json(model.toJSON());
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).json({msg: error.message,code: 'SYSERR'});
    });
  },
};
