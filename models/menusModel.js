var Checkit = require('checkit');
var db = require('../config/db');
var usersModel = require('./usersModel'),
    cuisinesModel = require('./cuisinesModel'),
    unitesModel =require('./unitesModel'),
    menugroupsModel=require('./menugroupsModel'),
    imagesModel=require('./imagesModel');
    

var menusModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments); // super()
    this.on('saving', this.validate.bind(this));
  },
  validations: {title: ['required'],price: ['required'],restaurant_id: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'menus',
  orderBy: function (column, order) {
        return this.query(function (qb) {
            qb.orderBy(column, order);
        });
    },
  menu_images: function() {
      return this.hasMany(imagesModel,'reference_id');
  },
  restaurant: function() {
      return this.belongsTo(usersModel,'restaurant_id');
  },
  cuisines: function() {
      return this.belongsTo(cuisinesModel,'cuisine_id');
  },
  unites: function() {
      return this.belongsTo(unitesModel,'unit_id');
  },
  menu_groups: function() {
    return this.belongsTo(menugroupsModel,'menu_group_id');
  },
});

module.exports = menusModel;
