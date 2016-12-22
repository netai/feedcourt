var models = require('../models');

module.exports = {
  // GET /portal/customers/view/:id
  customer_detail: function(req, res, next) {
     var sess = req.session;
    var id = req.params.id;
    models.customersModel.forge({id: id})
    .fetch({withRelated: ['addresses','addresses.state','addresses.city']})
    .then(function (model) {
      var context = {
        customer: model.toJSON(),
        'SessionData':sess
      };
      res.render('customer/customer_detail', context);
    })
    .catch(function (error) {
      //console.log(error.message);
      res.send('Sorry somthing is wrong');
    });
  },
  //GET /portal/customers
  customers_list: function(req, res, next) {
     var sess = req.session;
    models.customersModel.where({user_type:4})
    .fetchAll({withRelated: ['addresses','addresses.state','addresses.city']})
    .then(function (model) {

      if(model){
        var context = {
          customers: model.toJSON(),
          'SessionData':sess
        };
      } else {
        context = {
          customers: {},
          'SessionData':sess
        };
      }
      res.render('customer/customer_list', context);
    })
    .catch(function (error) {
      //console.log(error.message);
      res.redirect('/portal');
    });
  },
  // GET portal/customers/changestatus
  change_status: function(req, res, next) {
    var id = req.params.id;
    models.customersModel.forge({id:id})
    .fetch()
    .then(function (model) {
      var status = model.get('status')==1?0:1;
      model.save({status: status})
      .then(function(){
        res.redirect('/portal/customers');
      })
      .catch(function(error){
        console.log(error.message);
        res.redirect('/portal');
      });
    })
    .catch(function (error) {
      console.log(error.message);
      res.redirect('/portal');
    });
  }
};
