var foodcourtsModel = require('../models/foodcourtsModel');
var addressModel = require('../models/addressModel');
var statesModel = require('../models/statesModel');
var citiesModel = require('../models/citiesModel');
module.exports = {
  foodcourt_profile:function(req,res,next){
    var sess = req.session;
    var id = req.params.id;
    foodcourtsModel.forge({id: id})
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
}