var Checkit = require('checkit');
var db = require('../config/db');

var usersModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments); // super()
    this.on('saving', this.validate.bind(this));
  },
  validations: {email: ['required', 'email'], password: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'users'
});

module.exports = usersModel;
