var Checkit = require('checkit');
var db = require('../config/db');
var addressModel = require('./addressModel');
var citiesModel = require('./citiesModel');
var statesModel = require('./statesModel');
var customersModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments); // super()
    this.on('saving', this.validate.bind(this));
  },
  validations: {email: ['required', 'email'], password: ['required'],phone_no: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'users',
  addresses: function() {
      return this.belongsTo(addressModel,'address_id');
  },
  state: function() {
      return this.belongsTo(statesModel,'state_id');  // belongsTo, hasMany, morphMany, morphTo
  },
  city: function() {
      return this.belongsTo(citiesModel,'city_id');  // belongsTo, hasMany, morphMany, morphTo
  },
});

module.exports = customersModel;
