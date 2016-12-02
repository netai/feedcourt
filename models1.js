var Checkit = require('checkit');
var db = require('./config/db');

////////////////////////////////////////////////////////////USER MODEL
var usersModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments);
    this.on('saving', this.validate.bind(this));
  },
  validations: {password: ['required'],phone_no: ['required'], full_name: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'users',
  images: function() {
      return this.hasMany(imagesModel,'reference_id');
  },
  addresses: function() {
      return this.hasMany(addressModel,'user_id');
  },
  state: function() {
      return this.belongsTo(statesModel,'state_id');
  },
  city: function() {
      return this.belongsTo(citiesModel,'city_id');
  },
});

////////////////////////////////////////////////////////////CUSTOMER MODEL
var customersModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments);
    this.on('saving', this.validate.bind(this));
  },
  validations: {email: ['required', 'email'], password: ['required'],phone_no: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'users',
  addresses: function() {
    return this.hasMany(addressModel,'user_id');
  },
  state: function() {
      return this.belongsTo(statesModel,'state_id');
  },
  city: function() {
      return this.belongsTo(citiesModel,'city_id');
  },
});

////////////////////////////////////////////////////////////RESTAURANT MODEL
var restaurantsModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments);
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
  images: function() {
      return this.hasMany(imagesModel,'reference_id');
  },
  menu_groups: function() {
      return this.hasMany(menugroupsModel,'restaurant_id');
  },
});

////////////////////////////////////////////////////////////FOODCOURT MODEL
var foodcourtsModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments);
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
  restaurants: function() {
      return this.belongsTo(restaurantsModel,'parent_id');

  },
  addresses: function() {
      return this.hasMany(addressModel,'user_id');
  },
  state: function() {
      return this.belongsTo(statesModel,'state_id');
  },
  city: function() {
      return this.belongsTo(citiesModel,'city_id');
  },
  images: function() {
      return this.hasMany(imagesModel,'reference_id');
  },
});

////////////////////////////////////////////////////////////ADDRESS MODEL
var addressModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments);
    this.on('saving', this.validate.bind(this));
  },
  validations: {state_id: ['required'],city_id: ['required'],zip_code:['required'],phone_no:['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'addresses',
  state: function() {
      return this.belongsTo(statesModel,'state_id');
  },
  city: function() {
      return this.belongsTo(citiesModel,'city_id');
  }
});

////////////////////////////////////////////////////////////STATE MODEL
var statesModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments);
    this.on('saving', this.validate.bind(this));
  },
  validations: {name: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'states'
});

////////////////////////////////////////////////////////////CITY MODEL
var citiesModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments);
    this.on('saving', this.validate.bind(this));
  },
 orderBy: function (column, order) {
      return this.query(function (qb) {
          qb.orderBy(column, order);
      });
  },
  validations: {name: ['required'], state_id: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'cities',
   state: function() {
      return this.belongsTo(statesModel,'state_id');
  },
});

////////////////////////////////////////////////////////////IMAGE MODEL
var imagesModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments);
    this.on('saving', this.validate.bind(this));
  },
  validations: {img_name: ['required'], type: ['required'],reference_id: ['required'], added_by: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'images',
});

////////////////////////////////////////////////////////////MENU GROUP MODEL
var menugroupsModel =db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments);
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

////////////////////////////////////////////////////////////MENU MODEL
var menusModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments);
    this.on('saving', this.validate.bind(this));
  },
  validations: {title: ['required'],price: ['required'],restaurant_id: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'menus',
  orderBy: function (column) {
        return this.query(function (qb) {
            qb.orderBy(column, 'is_default');
        });
    },
  images: function() {
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

////////////////////////////////////////////////////////////CUISINE MODEL
var cuisinesModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments);
    this.on('saving', this.validate.bind(this));
  },
  orderBy: function (column, order) {
        return this.query(function (qb) {
            qb.orderBy(column, order);
        });
    },
  validations: {title: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'cuisines'
});

////////////////////////////////////////////////////////////UNIT MODEL
var unitesModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments);
    this.on('saving', this.validate.bind(this));
  },
  validations: {title: ['required'],restaurant_id: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'unites'
});

////////////////////////////////////////////////////////////REVIEWS MODEL
var reviewsModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments);
    this.on('saving', this.validate.bind(this));
  },
  validations: {review_by: ['required'],review_to: ['required'],comment: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'reviews',
  users: function() {
      return this.belongsTo(usersModel,'review_by');
  },
  restaurants: function() {
      return this.belongsTo(usersModel,'review_to');
  },
});

////////////////////////////////////////////////////////////ORDER MASTER MODEL
var orderMastersModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments);
    this.on('saving', this.validate.bind(this));
  },
  validations: {total_amount: ['required'], sub_total_amount: ['required'],customer_id: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'order_masters',
  customer: function() {
      return this.belongsTo(usersModel,'customer_id');
  },
  order_details: function() {
      return this.hasMany(orderDetailsModel,'order_master_id');
  },
  payment_details: function() {
    return this.belongsTo(paymentDetailsModel,'order_details_id');
  },
  payment_masters: function() {
      return this.hasOne(paymentMastersModel,'order_master_id');
  },
});

////////////////////////////////////////////////////////////ORDER DETAIL MODEL
var orderDetailsModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments);
    this.on('saving', this.validate.bind(this));
  },
  validations: {total_amount: ['required'], txn_no:['required'],customer_id: ['required']},
   validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'order_details',
  
  order_master: function() {
      return this.hasMany(orderMastersModel,'order_master_id');
  },
  restaurant: function() {
      return this.belongsTo(usersModel,'restaurant_id');
  },
  menu: function() {
      return this.belongsTo(menusModel,'menu_id');
  },
  ship_address: function() {
      return this.belongsTo(addressModel,'ship_address_id');
  },
  bill_address: function() {
      return this.belongsTo(addressModel,'bill_address_id');
  },
  payment_detail: function() {
      return this.belongsTo(paymentDetailsModel,'order_details_id');
  },
  
 
});

////////////////////////////////////////////////////////////PAYMENT MASTER MODEL
var paymentMastersModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments);
    this.on('saving', this.validate.bind(this));
  },
  validations: {total_amount: ['required'], txn_no:['required'],customer_id: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'payment_masters',
  payment_detail: function() {
      return this.hasMany(paymentDetailsModel,'payment_master_id');
  },
});

////////////////////////////////////////////////////////////PAYMENT DETAIL MODEL
var paymentDetailsModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments);
    this.on('saving', this.validate.bind(this));
  },
  tableName: 'payment_details',
});



var models = {
  usersModel : usersModel,
  customersModel : customersModel,
  restaurantsModel : restaurantsModel,
  foodcourtsModel : foodcourtsModel,
  orderMastersModel : orderMastersModel,
  orderDetailsModel : orderDetailsModel,
  paymentMastersModel : paymentMastersModel,
  paymentDetailsModel : paymentDetailsModel,
  addressModel : addressModel,
  statesModel : statesModel,
  citiesModel : citiesModel,
  imagesModel : imagesModel,
  menugroupsModel : menugroupsModel,
  menusModel : menusModel,
  cuisinesModel : cuisinesModel,
  unitesModel : unitesModel,
  reviewsModel : reviewsModel
};

module.exports = models;