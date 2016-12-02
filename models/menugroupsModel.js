var Checkit = require('checkit');
var db = require('../config/db');
var usersModel = require('./usersModel'),
    menusModel = require('./menusModel'),
    imagesModel=require('./imagesModel');


var menugroupsModel =db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments); // super()
    this.on('saving', this.validate.bind(this));
  },
  orderBy: function (column, order) {
        return this.query(function (qb) {
            qb.orderBy(column, order);
        });
    },
  validations: {name: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'menu_groups',
  images: function() {
      return this.hasMany(imagesModel,'reference_id');
  },
  menus: function() {
      return this.hasMany(menusModel,'menu_group_id');
  },
  restaurant: function() {
      return this.belongsTo(usersModel,'restaurant_id');
  }
});


module.exports = menugroupsModel;