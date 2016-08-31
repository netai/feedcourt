var foodcourtsModel = require('../models/foodcourtsModel'),
    statesModel = require('../models/statesModel'),
    citiesModel = require('../models/citiesModel'),
    addressModel = require('../models/addressModel'),
    restaurantsModel = require('../models/restaurantsModel');


module.exports = {
  
    // GET /foodcourts/:id/restaurants
  restaurants_list: function(req, res, next) {
    var foodcourt_id=req.params.id;
    restaurantsModel.query('orderBy', 'id', 'desc').where({'parent_id':foodcourt_id,'user_type':'3','status': 1})
        .fetchAll({withRelated: ['addresses','addresses.state','addresses.city',{images: function(query) { query.where({'type':'1','is_default':1}); }}]})
        .then(function (model) {
          var response = {
            restaurants: model.toJSON(),
            status: 'success'
          };
          res.json(response);
        })
        .catch(function (error) {
          res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});
        });
  },
  
  // GET /cities/:id/foodcourts
  foodcourt_list: function(req, res, next) {
    var city_id=parseInt(req.params.id);
    foodcourtsModel.query(function(qb) {
      qb.innerJoin('addresses', function () {
        this.on('users.id', '=', 'addresses.user_id')
        .andOn('addresses.city_id', '=', city_id);
      })})
    .orderBy('id','desc')
    .where({user_type:2, 'users.status':1})
    .fetchAll({withRelated: ['addresses','addresses.state','addresses.city',{images: function(query) { query.where({'type':'1'}); }}]})
    .then(function (model) {
      var response = {
        foodcourts: model.toJSON(),
        status: 'success',
      };
      res.json(response);
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});
    });
  },
};
