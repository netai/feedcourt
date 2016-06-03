var config = require('../config/app');
var jsonwebtoken = require('jsonwebtoken');

var secretKey = config.secretKey;

module.exports = {
  authenticated: function(req,res,next){
    console.log(req.body);
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];
    if(token){
      jsonwebtoken.verify(token, secretKey, function(err,decoded){
        if(err){
          res.status(403).send({status: 'error',code: '2403', message: 'failed to authenticat user'});
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.status(403).send({status:'error',code: '2403',message: 'No token provided'});
    }
  },
  portal_authenticated: function(req,res,next){
    var sess = req.session;
    if(sess.is_login && sess.id){
      // if(sess.user_type=='4'){
      //   req.session.destroy();
      //   res.redirect('/portal/login');
      // }
      next();
    } else {
      res.redirect('/portal/login');
    }
  },
  isAdmin: function(req, res, next){
    
  },
  
  // globalLocals: function (req, res, next) {
  //       res.locals({ 
  //           siteTitle: "My Website's Title",
  //           pageTitle: "The Root Splash Page",
  //           author: "Cory Gross",
  //           description: "My app's description",
  //       });
  //       next();
  //   },
  
  
};
