var Checkit = require('checkit');
var db = require('../config/db');
var paymentMastersModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments); // super()
    this.on('saving', this.validate.bind(this));
  },
  validations: {total_amount: ['required'], txn_no:['required'],customer_id: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'payment_masters',
});
module.exports = paymentMastersModel;