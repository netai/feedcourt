var Checkit = require('checkit');
var db = require('../config/db');
var orderMasterModel = require('./orderMasterModel');
var orderDetailsModel = require('./orderDetailsModel');
var paymentsModel = require('./paymentsModel');
var usersModel = require('./usersModel');
var addressModel = require('./addressModel');

var masterOrdersModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments); // super()
    this.on('saving', this.validate.bind(this));
  },
  validations: {email: ['required', 'email'], password: ['required'],phone_no: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'order_details',
  orderDetails: function() {
      return this.belongsTo(orderDetailsModel);  // belongsTo, hasMany, morphMany, morphTo
  },
  paymentDetail: function() {
      return this.hasOne(paymentsModel.'orderDetails.id','order_details_id');
  },
  shipAddress: function() {
      return this.hasOne(addressModel,'orderDetails.ship_address_id','id');

  },
  billAddress: function() {
      return this.hasOne(addressModel,'orderDetails.bill_address_id','id');

  },
  customer: function() {
      return this.hasOne(usersModel,'orderDetails.restaurant_id','id');

  },
  restaurant: function() {
      return this.hasOne(usersModel,'customer_id');

  }
});

module.exports = masterOrdersModel;
