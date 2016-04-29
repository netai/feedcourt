var Checkit = require('checkit');
var db = require('../config/db');
var addressModel = require('./addressModel');
var usersModel = require('./usersModel');
var orderMasterModel = require('./orderMasterModel');
var orderDetailsModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments); // super()
    this.on('saving', this.validate.bind(this));
  },
  validations: {price: ['required'], qty:['required'],order_master_id: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'order_details',
  orderMasterDetail: function() {
      return this.belongsTo(orderMasterModel,'order_master_id');  // belongsTo, hasMany, morphMany, morphTo
  },
  restaurantDetail: function() {
      return this.belongsTo(usersModel,'restaurant_id');  // belongsTo, hasMany, morphMany, morphTo
  },
  shipAddress: function() {
      return this.belongsTo(addressModel,'ship_address_id');  // belongsTo, hasMany, morphMany, morphTo
  },
  billAddress: function() {
      return this.belongsTo(addressModel,'bill_address_id');  // belongsTo, hasMany, morphMany, morphTo
  },
});

module.exports = orderDetailsModel;
