var Checkit = require('checkit'),
db = require('../config/db'),
statesModel = require('./statesModel');

var citiesModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments); // super()
    this.on('saving', this.validate.bind(this));
  },
 orderBy: function (column, order) {
      return this.query(function (qb) {
          qb.orderBy(column, order);
      });
  },
  validations: {name: ['required'], state_id: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'cities',
   state: function() {
      return this.belongsTo(statesModel,'state_id');
  },
});

module.exports = citiesModel;
