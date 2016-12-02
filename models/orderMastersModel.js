var Checkit = require('checkit'),
db = require('../config/db'),
usersModel = require('./usersModel'),
orderDetailsModel = require('./orderDetailsModel'),
paymentDetailsModel = require('./paymentDetailsModel'),
paymentMastersModel = require('./paymentMastersModel');


var orderMastersModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments); // super()
    this.on('saving', this.validate.bind(this));
  },
  validations: {total_amount: ['required'], sub_total_amount: ['required'],customer_id: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'order_masters',
  
  customer: function() {
      return this.belongsTo(usersModel,'customer_id');  // belongsTo, hasMany, morphMany, morphTo
  },
  order_details: function() {
      return this.hasMany(orderDetailsModel,'order_master_id');
      
  },
  payment_details: function() {
    return this.belongsTo(paymentDetailsModel,'order_details_id');
  },
  payment_masters: function() {
      return this.hasOne(paymentMastersModel,'order_master_id');
  },
});
module.exports = orderMastersModel;