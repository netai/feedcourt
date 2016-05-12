var foodcourtsModel = require('../models/foodcourtsModel');
var statesModel = require('../models/statesModel');
var citiesModel = require('../models/citiesModel');
var addressModel = require('../models/addressModel');
var restaurantsModel = require('../models/restaurantsModel');

module.exports = {
  // GET /portal/restaurants
  restaurant_list: function(req, res, next) {
    var id = req.params.id;
    foodcourtsModel.forge({id: id,user_type:2})
    .fetch()
    .then(function (model){
      var foodcourtDetail=model.toJSON();
       restaurantsModel.where({parent_id: id,user_type: 3})
      .fetchAll({withRelated: ['addresses','addresses.state','addresses.city']})
      .then(function (restaurant) {
        var context = {};
        if(restaurant){
          context = {
            foodcourt:foodcourtDetail,
            restaurants: restaurant.toJSON(),
            message: 'Foodcourt list',
            status: 'success',
          };
        } else {
          context = {
            foodcourt:{},
            restaurants:{},
            message: 'no foodcourt found',
            status: 'success',
          };
        }
        res.render('restaurant/restaurant_list', context);
      })
      .catch(function (error) {
         res.redirect('/portal/foodcourts');
      });
    })
    .catch(function (error) {
      res.redirect('/portal/foodcourts');
    });
  },
  // GET portal/foodcourts
  foodcourt_list: function(req, res, next) {
    var id = req.params.id;
    foodcourtsModel.where({user_type:2})
    .fetchAll({withRelated: ['addresses','addresses.state','addresses.city']})
    .then(function (model) {
      var context = {};
      if(model){
        context = {
          data: model.toJSON(),
          message: 'Foodcourt list',
          status: 'success',
        };
      } else {
        context = {
          data:{},
          message: 'no foodcourt found',
          status: 'success',
        };
      }
      res.render('foodcourt/foodcourt_list',{'dataJsonArr':context});
    })
    .catch(function (error) {
      var context = {
            data:{},
            message: error.message,
            status: 'error',
        };
      res.render('foodcourt/foodcourt_list',{'dataJsonArr':context});
    });
  },
    // GET portal/foodcourt_view/:id
  foodcourt_detail: function(req, res, next) {
    var id = req.params.id;
    foodcourtsModel.forge({id: id,user_type:2})
    .fetch({withRelated: ['addresses','addresses.state','addresses.city']})
    .then(function (model) {
     var context = {};
      if(model){
        context = {
          data: model.toJSON(),
          message: 'Foodcourt Detail',
          status: 'success',
        };
      } else {
        context = {
          data:{},
          message: 'no foodcourt found',
          status: 'success',
        };
      }
      res.render('foodcourt/foodcourt_detail',{'dataJsonArr':context});
    })
    .catch(function (error) {
     var context = {
            data:{},
            message: error.message,
            status: 'error',
            code: '2005'
      };
      res.render('foodcourt/foodcourt_detail',{'dataJsonArr':context});
    });
  },
  // GET portal/foodcourt/changestatus
  change_status: function(req, res, next) {
    var id = req.params.id;
    foodcourtsModel.forge({id:id})
    .fetch()
    .then(function (model) {
      var status = model.get('status')==1?0:1;
      model.save({status: status})
      .then(function(){
        res.redirect('/portal/foodcourts');
      })
      .catch(function(error){
        res.redirect('/portal');
      });
    })
    .catch(function (error) {
      res.redirect('/portal');
    });
  },
  // POST /portal/foodcourt/add
  add_foodcourt: function(req, res, next) {
    var id = req.body;
    res.render('foodcourt/foodcourt_add');
  },
  
  
};
