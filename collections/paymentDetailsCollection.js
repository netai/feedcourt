var Promise = require('bluebird');
var Checkit = require('checkit');
var db = require('../config/db');
var paymentDetails = db.Model.extend({
    tableName: 'payment_details'
});
var paymentDetailsCollection = db.Collection.extend({
 model: paymentDetails
});

module.exports = paymentDetailsCollection;
