var usersModel = require('../models/usersModel');
var tokenHelper = require('../helpers/token');

module.exports = {
  // GET /
  dashboard: function(req, res, next){
    var context = {
            error: 'Wrong email/password',
            sess: req.session
          };
    res.render('site/dashboard',context);
  },
  // ALL / portal login
  portal_login: function(req, res, next) {
    if(req.method == 'POST'){
      var email = req.body.email;
      var password = req.body.password;
      usersModel.forge({email: email,password: password})
      .fetch()
      .then(function (model) {
        if(model){
          var sess = req.session;
          sess.id = model.id;
          sess.user_type = model.get('user_type');
          sess.name = model.get('full_name');
          sess.email = model.get('email');
          sess.is_login = true;
          res.redirect('/portal/dashboard');
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
};
