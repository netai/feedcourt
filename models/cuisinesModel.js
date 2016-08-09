var Checkit = require('checkit');
var db = require('../config/db');

var cuisinesModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments); // super()
    this.on('saving', this.validate.bind(this));
  },
  orderBy: function (column, order) {
        return this.query(function (qb) {
            qb.orderBy(column, order);
        });
    },
  validations: {title: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'cuisines'
});

module.exports = cuisinesModel;
