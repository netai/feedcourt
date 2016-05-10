var Checkit = require('checkit');
var db = require('../config/db');

var statesModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments); // super()
    this.on('saving', this.validate.bind(this));
  },
  validations: {name: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'states'
});

module.exports = statesModel;
