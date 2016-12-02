var Promise = require('bluebird');
var Checkit = require('checkit');
var db = require('../config/db');
var orderDetails = db.Model.extend({
    tableName: 'order_details'
});
var orderDetailsCollection = db.Collection.extend({
 model: orderDetails
});

module.exports = orderDetailsCollection;
