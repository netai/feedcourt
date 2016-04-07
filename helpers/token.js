var config = require('../config/app');
var jsonwebtoken = require('jsonwebtoken');

var secretKey = config.secretKey;

module.exports = {
  createToken: function(user){
    var token = jsonwebtoken.sign({
      id: user.id,
      name: user.get('name'),
      email: user.get('email')
    }, secretKey, {
      expirtesInMinute: 1440
    });
    return token;
  }
};
