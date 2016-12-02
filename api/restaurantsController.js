var models = require('../models1');
    
module.exports = {
  
  // GET /restaurants/:id
  restaurantDetail: function(req, res, next) {
    var id = req.params.id;
    models.restaurantsModel.forge({id:id,'user_type':3})
    .fetch({withRelated: ['addresses','addresses.state','addresses.city',
    {images:function(query){query.where({'status':1,'type':1});}},
    {menu_groups: function(query) { query.where({'status': 1});}},
    {'menu_groups.images':function(query){query.where({'status':1,'type':3});}},
    {'menu_groups.menus':function(query){query.where({'status':1});}},
    {'menu_groups.menus.images':function(query){query.where({'status':1,'type':2});}},
    {'menu_groups.menus.unites':function(query){query.where({'status':1});}}
    ]})
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
  }
  
};
