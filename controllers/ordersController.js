var orderDetailsModel = require('../models/orderDetailsModel');

module.exports = {
  // GET /portal/order/view/:id
  order_detail: function(req, res, next) {
     var id = req.params.id;
     orderDetailsModel.where({order_master_id: id})
    .fetchAll({withRelated: ['orderMaster','restaurant','orderMaster.customer','shipAddress','billAddress','shipAddress.state','shipAddress.city','billAddress.state','billAddress.city']})
    .then(function (model) {
      var context = {};
      if(model){
        context = {
          data: model.toJSON(),
          message: 'Order Detail',
          status: 'success',
        };
      } else {
        context = {
          message: 'No Order Found',
          status: 'success',
        };
      }
      res.render('order/order_view',{'dataJsonArr':context});
    })
    .catch(function (error) {
       var context = {
            message: error.message,
            status: 'error',
        };
       res.render('order/order_view',{'dataJsonArr':context});
    });
  },
 // GET /portal/orders
  order_list: function(req, res, next) {
    orderDetailsModel.forge()
    .fetchAll({withRelated: ['orderMaster','restaurant']})
    .then(function (model) {
      var context = {};
      if(model){
        context = {
          data: model.toJSON(),
          message: 'Order List',
          status: 'success',
        };
      } else {
        context = {
          message: 'No Record Found',
          status: 'success',
        };
      }
      res.render('order/order_list',{'dataJsonArr':context});
    })
    .catch(function (error) {
       var context = {
            message: error.message,
            status: 'error',
        };
       res.render('order/order_list',{'dataJsonArr':context});
    });
  },
  
  
  
  
  
  // GET /Orders under Restaurant/:id
  getRestaurantOrders: function(req, res, next) {
    var id = req.params.id;
    orderDetailsModel.where({restaurant_id:id})
    .fetchAll({withRelated: ['orderMasterDetail','restaurantDetail','shipAddress','billAddress']})
    .then(function (model) {
      //console.log(model.toJSON());
      var context = {};
        if(model){
          context = {
            data: model.toJSON(),
            message: 'Restaurant list under foodcourt.',
            status: 'success',
            code: '1005'
          };
        } else {
          var context = {
            message: 'no restaurant found under foodcourt',
            status: 'success',
            code: '1005'
          };
        }
        //res.json(response);
        res.render('order/order_list',{'dataJsonArr':context});
    })
    .catch(function (error) {
      var context = {
            message: error.message,
            status: 'error',
            code: '2005'
        };
      res.render('order/order_list',{'dataJsonArr':context});
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
        var context = {
          message: 'Restaurant status update successfully.',
          status: 'success',
          code: '2006'
        };
      })
      res.json(context);
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message});
    });
  }
};
