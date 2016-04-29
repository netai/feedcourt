var orderDetailsModel = require('../models/orderDetailsModel');

module.exports = {
  // GET /Orders
  getOrders: function(req, res, next) {
    orderDetailsModel.forge()
    .fetchAll({withRelated: ['orderMasterDetail','restaurantDetail']})
    .then(function (model) {
      response = {};
      if(model){
        console.log(model.toJSON());
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
  // GET /Orders under Restaurant/:id
  getRestaurantOrders: function(req, res, next) {
    var id = req.params.id;
    orderDetailsModel.where({restaurant_id:id})
    .fetchAll({withRelated: ['orderMasterDetail','restaurantDetail','shipAddress','billAddress']})
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
    orderDetailsModel.forge({id:id})
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
