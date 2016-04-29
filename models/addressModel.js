var Checkit = require('checkit');
var db = require('../config/db');

var addressModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments); // super()
    this.on('saving', this.validate.bind(this));
  },
  validations: {country_id: ['required'], state_id: ['required'],city_id: ['required'],zip_code:['required'],phone_no:['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'addresses'
});

module.exports = addressModel;
