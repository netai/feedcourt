var Checkit = require('checkit');
var db = require('../config/db');
var orderDetailsModel = require('./orderDetailsModel');
var paymentsModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments); // super()
    this.on('saving', this.validate.bind(this));
  },
  validations: {price: ['required'], qty:['required'],order_master_id: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'payments',
  orderDetails: function() {
      return this.belongsTo(orderDetailsModel,'order_details_id');  // belongsTo, hasMany, morphMany, morphTo
  },
});

module.exports = paymentsModel;
