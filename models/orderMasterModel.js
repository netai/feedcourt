var Checkit = require('checkit');
var db = require('../config/db');
var usersModel = require('./usersModel');
var orderMasterModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments); // super()
    this.on('saving', this.validate.bind(this));
  },
  validations: {total_amount: ['required'], sub_total_amount:['required'],invoice_id: ['required'],customer_id:['required'],restaurant_id:['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'order_master',
  customer: function() {
      return this.belongsTo(usersModel,'customer_id');  // belongsTo, hasMany, morphMany, morphTo
  },
});

module.exports = orderMasterModel;
