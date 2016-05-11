var usersModel = require('../models/usersModel');
var tokenHelper = require('../helpers/token');

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
            sess.id = model.id;
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
  
  //GET /portal/logout
  portal_logout: function(req, res, next){
    req.session.destroy();
    res.redirect('/portal/login');
  }
  
};
