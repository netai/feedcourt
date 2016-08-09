var restaurantsModel = require('../models/restaurantsModel'),
    foodcourtsModel = require('../models/foodcourtsModel'),
    citiesModel = require('../models/citiesModel'),
    imagesModel =require('../models/imagesModel');

module.exports = {
  
  // GET /restaurant/:id
  restaurantDetail: function(req, res, next) {
    var id = req.params.id;
    restaurantsModel.forge({id:id})
    .fetch({withRelated: ['addresses','addresses.state','addresses.city']})
    .then(function (model) {
      var response = {};
        if(model){
            imagesModel.where({reference_id:id, type:'1'})
            .fetchAll()
            .then(function (images){
              if(model.get('status') == 1){
                response = {
                  data: model.toJSON(),
                  status: 'success'
                };
                response.data.images = images.toJSON();
              } else {
                response = {
                  message: 'restaurant blocked by admin',
                  status: 'error',
                  code: '2007'
                };
              }
              res.json(response);
              //response.data['images'] = images.toJSON();
            });
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
