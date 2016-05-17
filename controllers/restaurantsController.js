var restaurantsModel = require('../models/restaurantsModel');
var foodcourtsModel = require('../models/foodcourtsModel');
var citiesModel = require('../models/citiesModel');

module.exports = {
  // GET /portal/restaurants/view/:id
  restaurants_detail: function(req, res, next) {
    var id = req.params.id;
      restaurantsModel.forge({id:id})
    .fetch({withRelated: ['addresses','addresses.state','addresses.city']})
    .then(function (model) {
          var context = {
            restaurant: model.toJSON()
          };
          res.render('restaurant/restaurants_detail', context);
    })
    .catch(function (error) {
      console.log(error.message);
      res.send('Sorry somthing is wrong');
    });
  },

  // GET /portal/restaurants
  restaurants_list: function(req, res, next) {
    restaurantsModel.where({user_type: 3})
    .fetchAll({withRelated: ['addresses','addresses.state','addresses.city']})
    .then(function (model) {
      if(model){
        var context = {
          restaurants: model.toJSON(),
        };
      } else {
        context = {
          restaurants: {}
        };
      }

      res.render('restaurant/restaurant_list', context);
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
      var response = {};
        if(model){
          response = {
            data: model.toJSON(),
            message: 'Restaurant list under foodcourt.',
            status: 'success',
          };
        } else {
          response = {
            message: 'no restaurant found under foodcourt',
            status: 'success',
          };
        }
        res.json(response);
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message});
    });
  },
  // Put /Resturant/Changestatus
  change_status: function(req, res, next) {
    var id = req.params.id;
    restaurantsModel.forge({id:id})
    .fetch()
    .then(function (model) {
      var status = model.get('status')==1?0:1;
      model.save({status: status})
      .then(function(){
        res.redirect('/portal/restaurants');
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
  },
  // POST /portal/restaurant/add
  add_restaurant: function(req, res, next) {
    if(req.method == 'POST'){
        console.log(req.method);
    } else {
      res.render('restaurant/restaurant_add');
    }
  },
};
