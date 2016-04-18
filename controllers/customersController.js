var usersModel = require('../models/usersModel');

module.exports = {
  // GET /customer/:id
  getCustomer: function(req, res, next) {
    var id = req.params.id;
    usersModel.forge({id: id})
    .fetch()
    .then(function (model) {
      res.json(usersModel.toJSON());
    })
    .otherwise(function (error) {
      res.status(500).json({msg: error.message});
    });
  },
  //GET /customers
  getCustomers: function(req, res, next) {
    usersModel.query('where','user_type','=', '4')
    .fetchAll()
    .then(function (model) {
      response = {};
      if(model){
        response = {
          data: model.toJSON(),
          message: 'customer list',
          status: 'success',
          code: '1003'
        };
      } else {
        response = {
          message: 'no customer found',
          status: 'success',
          code: '1003'
        };
      }

      res.json(response);
    })
    .otherwise(function (error) {
      res.status(500).json({msg: error.message});
    });
  },
  // Put /Customers/Changestatus
  changeStatus: function(req, res, next) {
    var id = req.body.id;
    var status = req.body.status;
    usersModel.forge({id:id})
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
    .otherwise(function (error) {
      res.status(500).json({msg: error.message});
    });
  }
};
