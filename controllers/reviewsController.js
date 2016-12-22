var models = require('../models');
    
module.exports = {
  // GET /portal/reviews/
  review_list: function(req, res, next) {
    var req_foodcourt_id="";
    var req_restaurant_id="";
    
    var sess = req.session;
    var review_conditions={};
    if(req.param('foodcourt')!==undefined){
      review_conditions={'review_to':req.param('foodcourt')};
      req_foodcourt_id=req.param('foodcourt');
    }
    else if(req.param('restaurant')!==undefined){
      review_conditions={'review_to':req.param('restaurant')};
      req_restaurant_id=req.param('restaurant');
    }
    
    
    if(sess.user_type!==undefined && sess.user_type==3){
      var review_conditions={review_to:sess.user_id};
    }
    var context ={};
    models.reviewsModel.where('status','!=','2')
    .where(review_conditions)
    .fetchAll({withRelated: ['users','restaurants']})
    .then(function (model) {
      if(model){
        context={'reviews':model.toJSON(),'SessionData':sess,'req_restaurant_id':req_restaurant_id,'req_foodcourt_id':req_foodcourt_id};
      } else {
        context={'reviews':{},'SessionData':sess,'req_restaurant_id':req_restaurant_id,'req_foodcourt_id':req_foodcourt_id};
      }
       res.render('review/review_list', context);
    })
    .catch(function (error) {
      res.redirect('/portal');
    });
  },
  // Put /Resturant/Changestatus
  change_status: function(req, res, next) {
    var id = req.query.id;
    var status='';
    if(typeof req.query.action !=undefined && req.query.action=='approve'){
      status='1';
    } else if(typeof req.query.action !=undefined && req.query.action=='delete'){
      status='2';
    }
    if(status!=""){
      models.reviewsModel.forge({id:req.query.id})
      .fetch()
      .then(function (model) {
        model.save({status: status})
        .then(function(){
          res.redirect('/portal/reviews');
        })
        .catch(function(error){
          res.redirect('/portal/reviews');
        });
      })
      .catch(function (error) {
          console.log(error.message);
          res.redirect('/portal');
      });
    } else {
      res.redirect('/portal/reviews');
    }
  },
};
