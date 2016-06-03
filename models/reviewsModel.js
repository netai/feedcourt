
var Checkit = require('checkit');
var db = require('../config/db');

var usersModel = require('./usersModel');

var reviewsModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments); // super()
    this.on('saving', this.validate.bind(this));
  },
  validations: {review_by: ['required'],review_to: ['required'],comment: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'reviews',
  users: function() {
      return this.belongsTo(usersModel,'review_by');
  },
  restaurants: function() {
      return this.belongsTo(usersModel,'review_to');
  },
});

module.exports = reviewsModel;
