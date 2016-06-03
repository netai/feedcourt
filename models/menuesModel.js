var Checkit = require('checkit');
var db = require('../config/db');
var usersModel = require('./usersModel'),
    cuisinesModel = require('./cuisinesModel'),
    unitesModel =require('../models/unitesModel');

var menuesModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments); // super()
    this.on('saving', this.validate.bind(this));
  },
  validations: {cuisine_id: ['required'],title: ['required'],price: ['required'],added_by: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'menus',
  restaurant: function() {
      return this.belongsTo(usersModel,'added_by');

  },
  cuisines: function() {
      return this.belongsTo(cuisinesModel,'cuisine_id');
  },
  unites: function() {
      return this.belongsTo(unitesModel,'unit_id');
  },
});

module.exports = menuesModel;
