var customersModel = require('../models/customersModel');

module.exports = {
  // GET /customer/:id
  customer_detail: function(req, res, next) {
    var id = req.params.id;
    customersModel.forge({id: id})
    .fetch({withRelated: ['addresses','addresses.state','addresses.city']})
    .then(function (model) {
      var context = {
        customer: model.toJSON()
      };
      res.render('customer/customer_detail', context);
    })
    .catch(function (error) {
      console.log(error.message);
      res.send('Sorry somthing is wrong');
    });
  },
  //GET /portal/customers
  customers_list: function(req, res, next) {
    customersModel.where({user_type:4})
    .fetchAll({withRelated: ['addresses','addresses.state','addresses.city']})
    .then(function (model) {

      if(model){
        var context = {
          customers: model.toJSON()
        };
      } else {
        context = {
          customers: {}
        };
      }
      
      res.render('customer/customer_list', context);
    })
    .catch(function (error) {
      console.log(error.message);
      res.redirect('/portal');
    });
  },
  // Put /Customers/Changestatus
  changeStatus: function(req, res, next) {
    var id = req.body.id;
    var status = req.body.status;
    customersModel.forge({id:id})
    .fetch()
    .then(function (model) {
      model.save({status: status})
      .then(function(){
        response = {
          message: 'Customer status update successfully.',
          status: 'success',
          code: '1004'
        };
      })
      .catch(function(){
        response = {
          message: 'customer status update unsuccessfull.',
          status: 'error',
          code: '2004'
        };
      });

      res.json(response);
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message});
    });
  }
};
