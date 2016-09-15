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
  },
  
  createAPIToken: function(device){
    var token = jsonwebtoken.sign({
      device_id: device.device_id,
      device_name: device.device_name
    }, secretKey, {
      expirtesInMinute: 1440
    });
    return token;
  }
};
