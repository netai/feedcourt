var restaurantsModel = require('../models/restaurantsModel'),
    foodcourtsModel = require('../models/foodcourtsModel'),
    citiesModel = require('../models/citiesModel'),
    imagesModel =require('../models/imagesModel');

module.exports = {
  
  // GET /restaurants/:id
  restaurantDetail: function(req, res, next) {
    var id = req.params.id;
    restaurantsModel.forge({id:id,'user_type':3})
    .fetch({withRelated: ['addresses','addresses.state','addresses.city','menu_groups','menu_groups.menus',{images: function(query) { query.where({'type':'1','is_default':1}); }}]})
    .then(function (model) {
      var response = {};
      if(model){
        if(model.get('status') == 1){
          response = {
            restaurant: model.toJSON(),
            status: 'success'
          };
        } else {
          response = {
            message: 'restaurant blocked by admin',
            status: 'error',
            code: '2007'
          };
        }
        res.json(response);
        } else {
          response = {
            message: 'restaurant not found',
            status: 'error',
            code: '2006'
          };
          res.json(response);
        }
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});
    });
  },

};
