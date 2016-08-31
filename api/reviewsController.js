var reviewsModel = require('../models/reviewsModel');
    
module.exports = {
  
  // GET /restaurants/:id/reviews
  restaurant_reviews: function(req, res, next) {
    var restaurant_id = req.params.id;
    reviewsModel.where('status','=','1')
    .where({review_to: restaurant_id})
    .fetchAll({withRelated: ['users']})
    .then(function (model) {
      var response = {
        reviews: model.toJSON(),
        status: 'success',
      };
      res.json(response);
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});
    });
  },

  // POST /restaurants/reviews
  add_restaurant_reviews: function(req, res, next) {
    var review_data={
      'review_by': req.decoded.id,
      'review_to': req.body.restaurant_id,
      'comment': req.body.comment,
      'status': 0
    };
    var response = {};
    reviewsModel.forge(review_data)
    .save()
    .then(function (model) {
      if(model){
        response = {
          review: model.toJSON(),
          message: 'Review saved successfully',
          status: 'success'
        };
      } else {
        response = {
          message: 'Review not saved successfully',
          status: 'error',
          code: '2008'
        };
      }
      res.json(response);
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});
    });
  },
};
