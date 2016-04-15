var config = require('../config/app');
var jsonwebtoken = require('jsonwebtoken');

var secretKey = config.secretKey;

module.exports = {
  createToken: function(user){
    var token = jsonwebtoken.sign({
      id: user.id,
      user_type: user.get('user_type')
    }, secretKey, {
      expirtesInMinute: 1440
    });
    return token;
  }
};
