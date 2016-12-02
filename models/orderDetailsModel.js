var Checkit = require('checkit'),
db = require('../config/db');
var orderDetailsModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments); // super()
    this.on('saving', this.validate.bind(this));
  },
  validations: {total_amount: ['required'], txn_no:['required'],customer_id: ['required']},
   validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'order_details',
 
});

module.exports = orderDetailsModel;
