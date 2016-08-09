var Checkit = require('checkit'),
    db = require('../config/db'),
    addressModel = require('./addressModel'),
    citiesModel = require('./citiesModel'),
    statesModel = require('./statesModel'),
    usersModel = require('./usersModel'),
    imagesModel = require('./imagesModel');

var foodcourtsModel = db.Model.extend({
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
  foodcourt: function() {
      return this.belongsTo(usersModel,'parent_id');

  },
  addresses: function() {
      return this.hasMany(addressModel,'user_id');
  },
  state: function() {
      return this.belongsTo(statesModel,'state_id');  // belongsTo, hasMany, morphMany, morphTo
  },
  city: function() {
      return this.belongsTo(citiesModel,'city_id');  // belongsTo, hasMany, morphMany, morphTo
  },
  images: function() {
      return this.hasMany(imagesModel,'reference_id');
  },
});

module.exports = foodcourtsModel;
