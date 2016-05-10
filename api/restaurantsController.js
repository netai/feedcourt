var restaurantsModel = require('../models/restaurantsModel');
var foodcourtsModel = require('../models/foodcourtsModel');
var citiesModel = require('../models/citiesModel');

module.exports = {
  // GET /Restaurant/:id
  getRestaurant: function(req, res, next) {
    var id = req.params.id;
      restaurantsModel.forge({id:id})
    .fetch()
    .then(function (model) {
      response = {};
        if(model){
          response = {
            data: model.toJSON(),
            message: 'Restaurant detail',
            status: 'success',
            code: '1005'
          };
        } else {
          response = {
            message: 'no restaurant found',
            status: 'success',
            code: '1005'
          };
        }
        res.json(response);
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message});
    });
  },

  // GET /Restaurants
  getRestaurants: function(req, res, next) {
    restaurantsModel.where({user_type: 3})
    .fetchAll({withRelated: ['addresses','addresses.state','addresses.city']})
    .then(function (model) {
      response = {};
      if(model){
        response = {
          data: model.toJSON(),
          message: 'Restaurant list',
          status: 'success',
          code: '1005'
        };
      } else {
        response = {
          message: 'no restaurant found',
          status: 'success',
          code: '1005'
        };
      }

      res.json(response);
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message});
    });
  },
  // GET /Restaurant under foodcourt/:id
  getFoodcourtRestaurant: function(req, res, next) {
    var id = req.params.id;
    foodcourtsModel.where({user_type:3,parent_id:id})
    .fetchAll({withRelated: ['addresses','foodcourt']})
    .then(function (model) {
      console.log(model.toJSON());
      response = {};
        if(model){
          response = {
            data: model.toJSON(),
            message: 'Restaurant list under foodcourt.',
            status: 'success',
            code: '1005'
          };
        } else {
          response = {
            message: 'no restaurant found under foodcourt',
            status: 'success',
            code: '1005'
          };
        }
        res.json(response);
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message});
    });
  },
  // Put /Resturant/Changestatus
  changeStatus: function(req, res, next) {
    var id = req.body.id;
    var status = req.body.status;
    restaurantsModel.forge({id:id})
    .fetch()
    .then(function (model) {
      model.save({status: status})
      .then(function(){
        response = {
          message: 'Restaurant status update successfully.',
          status: 'success',
          code: '2006'
        };
      })
      .catch(function(err){
        response = {
          message: 'Restaurant status update unsuccessfull.',
          status: 'error',
          code: '2006'
        };
      });

      res.json(response);
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message});
    });
  }
};
