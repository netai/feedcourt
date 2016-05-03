var Checkit = require('checkit');
var db = require('../config/db');
var statesModel = require('./statesModel');
var citiesModel = require('./citiesModel');
var addressModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments); // super()
    this.on('saving', this.validate.bind(this));
  },
  validations: {country_id: ['required'], state_id: ['required'],city_id: ['required'],zip_code:['required'],phone_no:['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'addresses',
  state: function() {
      return this.belongsTo(statesModel,'state_id');
  },
  city: function() {
      return this.belongsTo(citiesModel,'city_id');
  }
});

module.exports = addressModel;
