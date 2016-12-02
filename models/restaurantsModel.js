var Checkit = require('checkit'),
    db = require('../config/db'),
    addressModel = require('./addressModel'),
    citiesModel = require('./citiesModel'),
    statesModel = require('./statesModel'),
    menugroupsModel = require('./menugroupsModel'),
    menusModel=require('../models/menusModel'),
    imagesModel = require('./imagesModel');



var restaurantsModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments); // super()
    this.on('saving', this.validate.bind(this));
  },
  orderBy: function (column, order) {
        return this.query(function (qb) {
            qb.orderBy(column, order);
        });
    },
  validations: {email: ['required', 'email'], password: ['required'],phone_no: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'users',
  addresses: function() {
      return this.hasMany(addressModel,'user_id');
  },
/*  state: function() {
      return this.belongsTo(statesModel,'state_id');  // belongsTo, hasMany, morphMany, morphTo
  },
  city: function() {
      return this.belongsTo(citiesModel,'city_id');  // belongsTo, hasMany, morphMany, morphTo
  },*/
  images: function() {
      return this.hasMany(imagesModel,'reference_id');
  },
  menu_groups: function() {
      return this.hasMany(menugroupsModel,'restaurant_id');
  },
  
/*  resturant_images: function() {
      return this.hasMany(imagesModel,'reference_id');
  },
  menu_group_images: function() {
      return this.hasMany(imagesModel,'reference_id');
  },
  restaurant_menus:function(){
    return this.hasMany(menusModel,'restaurant_id');
  },
  menu_images: function() {
      return this.hasMany(imagesModel,'reference_id');
  },*/
});

module.exports = restaurantsModel;
