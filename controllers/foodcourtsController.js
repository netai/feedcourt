var foodcourtsModel = require('../models/foodcourtsModel');
module.exports = {
  // GET /Foodcourt/:id
  getFoodcourt: function(req, res, next) {
    var id = req.params.id;
    foodcourtsModel.forge({id: id,user_type:2})
    .fetch()
    .then(function (model) {
      res.json(foodcourtsModel.toJSON());
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message});
    });
  },
  // GET /Foodcourts
  getFoodcourts: function(req, res, next) {
    foodcourtsModel.where({user_type:2})
    .fetchAll({withRelated: ['addresses']})
    .then(function (model) {
      response = {};

      if(model){
        response = {
          data: model.toJSON(),
          message: 'Foodcourt list',
          status: 'success',
          code: '1007'
        };
      } else {
        response = {
          message: 'no foodcourt found',
          status: 'success',
          code: '1007'
        };
      }

      res.json(response);
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message});
    });
  },
  // Put /Foodcourts/Changestatus
  changeStatus: function(req, res, next) {
    var id = req.body.id;
    var status = req.body.status;
    foodcourtsModel.forge({id:id})
    .fetch()
    .then(function (model) {
      model.save({status: status})
      .then(function(){
        response = {
          message: 'Foodcourt status update successfully.',
          status: 'success',
          code: '2007'
        };
      })
      .catch(function(err){
        response = {
          message: 'Foodcourt status update unsuccessfull.',
          status: 'error',
          code: '2007'
        };
      });

      res.json(response);
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message});
    });
  }
};
