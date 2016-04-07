var db = require('../config/db');

var usersModel = db.Model.extend({
  tableName: 'users'
});

module.exports = usersModel;
