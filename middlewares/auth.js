var config = require('../config/app');
var jsonwebtoken = require('jsonwebtoken');

var secretKey = config.secretKey;

module.exports = {
  authenticated: function(req,res,next){
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
  isAdmin: function(req, res, next){
    if(req.decoded.user_type==1){
      next();
    } else {
      res.status(403).send({status:'error',code: '2403',message: 'Access Denied'});
    }
  }
};
