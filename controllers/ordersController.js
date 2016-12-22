var models = require('../models');

module.exports = {
  // GET /portal/order/view/:id
  order_detail: function(req, res, next) {
    var sess = req.session;
     var id = req.params.id;
     models.orderDetailsModel.where({'id': id})
    .fetchAll({withRelated: ['order_master','order_master.payment_master','order_master.customer','restaurant','menu','ship_address','ship_address.state','ship_address.city','bill_address','bill_address.state','bill_address.city','payment_detail']})
    .then(function (model) {
      var context = {};
      if(model){
        context = {
          orders: model.toJSON(),
          'SessionData':sess,
          message: 'Order Detail',
          status: 'success',
        };
      } else {
        context = {
          orders:{},
          'SessionData':sess,
          message: 'No Order Found',
          status: 'success',
        };
      }
      //res.json(context);
      res.render('order/order_view',context);
    })
    .catch(function (error) {
       var context = {
            orders:{},
            'SessionData':sess,
            message: error.message,
            status: 'error',
        };
       res.redirect('/portal/orders');
    });
  },
 // GET /portal/orders
  order_list: function(req, res, next) {
    var sess = req.session;
    models.orderDetailsModel.forge()
    .fetchAll({withRelated: [{'order_master':function(query){query.orderBy("order_date");}},'order_master.payment_master','payment_detail']})
    .then(function (model) {
      var context = {};
      if(model){
        context = {
          orders: model.toJSON(),
          'SessionData':sess,
          message: 'Order List',
          status: 'success',
        };
      } else {
        context = {
          orders:{},
          'SessionData':sess,
          message: 'No Record Found',
          status: 'success',
        };
      }
      res.render('order/order_list',context);
    })
    .catch(function (error) {
       var context = {
         orders:{},
         'SessionData':sess,
          message: error.message,
          status: 'error',
        };
       res.redirect('/portal/orders');
    });
  },
  
  // GET /Orders under Restaurant/:id
  getRestaurantOrders: function(req, res, next) {
    var sess = req.session;
    var id = req.params.id;
    models.orderDetailsModel.where({'restaurant_id':id})
    .fetchAll({withRelated: [{'order_master':function(query){query.orderBy("order_date");}},'order_master.payment_master','payment_detail']})
    .then(function (model) {
      //console.log(model.toJSON());
      var context = {};
        if(model){
          context = {
            orders: model.toJSON(),
            'SessionData':sess,
            message: 'Restaurant order list.',
            status: 'success',
            code: '1005'
          };
        } else {
          var context = {
            orders:{},
            'SessionData':sess,
            message: 'no order found',
            status: 'success',
            code: '1005'
          };
        }
        //res.json(response);
        res.render('order/order_list',context);
    })
    .catch(function (error) {
      var context = {
            orders:{},
            'SessionData':sess,
            message: error.message,
            status: 'error',
            code: '2005'
        };
      res.redirect('/portal/restaurants');
    });
  },
  // post /Change order status
  changeOrderStatus: function(req, res, next) {
    var id = req.body.id;
    var status = req.body.status;
    models.orderDetailsModel.forge({id:id})
    .fetch()
    .then(function (model) {
      var order_detail=model.toJSON();
      model.save({status: status})
      .then(function(){
        if(status==1){
          models.orderMastersModel.forge({'id':order_detail.order_master_id}).fetch().then(function (order_master_model) {
            var order_maste=order_master_model.toJSON();
            order_master_model.save({'status': '1'}).then(function(){
               models.paymentDetailsModel.forge({'order_details_id':order_detail.id})
               .fetch()
               .then(function (payment_detail_model) {
                  payment_detail_model.save({'status': '1'})
                  .then(function(){
                    //Need to update payment Master
                    
                  });
               });
            });
          });
        }
        var context = {
          message: 'Order status has been changed successfully.',
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
