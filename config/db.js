var app_config = require('./app');

var knex = require('knex')({client: 'mysql', connection: app_config.mysql });
var bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;
