var restaurantsModel = require('../models/restaurantsModel');
var foodcourtsModel = require('../models/foodcourtsModel');
var citiesModel = require('../models/citiesModel');
var addressModel = require('../models/addressModel');
var usersModel = require('../models/usersModel');
var menuesModel =require('../models/menuesModel');
var utility = require('../helpers/utility');
var fs   = require('fs-extra'),
    path = require('path'),
    util = require('util');

module.exports = {
  // GET /portal/restaurants/view/:id
  restaurants_detail: function(req, res, next) {
    var sess = req.session;
    var id = req.params.id;
    if(typeof sess.user_type!='undefined' && sess.user_type=='3'){
        restaurantsModel.forge({id:sess.user_id})
        .fetch({withRelated: ['addresses','addresses.state','addresses.city']})
        .then(function (model) {
          var context = {
            restaurant: model.toJSON(),
            'SessionData':sess,
          };
          res.render('restaurant/restaurants_detail', context);
        })
        .catch(function (error) {
          //console.log(error.message);
          res.send('Sorry somthing is wrong');
        });
        
    } else{
      
      restaurantsModel.forge({id:id})
      .fetch({withRelated: ['addresses','addresses.state','addresses.city']})
      .then(function (model) {
        var context = {
          restaurant: model.toJSON(),
          'SessionData':sess,
        };
        res.render('restaurant/restaurants_detail', context);
      })
      .catch(function (error) {
        //console.log(error.message);
        res.send('Sorry somthing is wrong');
      });
    }
    
  },

  // GET /portal/restaurants
  restaurants_list: function(req, res, next) {
    var sess = req.session;
    if(typeof sess.user_type!='undefined' && sess.user_type=='3'){
      res.redirect('/portal');
    }
    if(typeof sess.user_type!='undefined' && sess.user_type=='2'){
        restaurantsModel.where({'parent_id':sess.user_id,'user_type':'3'})
        .fetchAll({withRelated: ['addresses','addresses.state','addresses.city']})
        .then(function (model) {
          if(model){
            var context = {
              restaurants: model.toJSON(),
              'SessionData':sess,
            };
          } else {
            context = {
              restaurants: {},
              'SessionData':sess,
            };
          }
          res.render('restaurant/restaurant_list', context);
        })
        .catch(function (error) {
          res.status(500).json({msg: error.message});
        });
    } else {
      restaurantsModel.where({user_type: 3})
        .fetchAll({withRelated: ['addresses','addresses.state','addresses.city']})
        .then(function (model) {
          if(model){
            var context = {
              restaurants: model.toJSON(),
              'SessionData':sess,
            };
          } else {
            context = {
              restaurants: {},
              'SessionData':sess,
            };
          }
          res.render('restaurant/restaurant_list', context);
        })
        .catch(function (error) {
          res.status(500).json({msg: error.message});
        });
      
    }
  },
  // GET /Restaurant under foodcourt/:id
  // getFoodcourtRestaurant: function(req, res, next) {
  //   var sess = req.session;
  //   var id = req.params.id;
  //   foodcourtsModel.where({user_type:3,parent_id:id})
  //   .fetchAll({withRelated: ['addresses','foodcourt']})
  //   .then(function (model) {
  //     var response = {};
  //       if(model){
  //         response = {
  //           foodcourts: model.toJSON(),
  //           'SessionData':sess,
  //           message: 'Restaurant list under foodcourt.',
  //           status: 'success',
  //         };
  //       } else {
  //         response = {
  //           foodcourts:{},
  //           'SessionData':sess,
  //           message: 'no restaurant found under foodcourt',
  //           status: 'success',
  //         };
  //       }
  //       res.json(response);
  //   })
  //   .catch(function (error) {
  //     res.status(500).json({msg: error.message});
  //   });
  // },
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
        //console.log(error.message);
        res.redirect('/portal');
      });
    })
    .catch(function (error) {
       // console.log(error.message);
        res.redirect('/portal');
    });
  },
  // GET or POST /portal/restaurant/add
   add_restaurant: function(req, res, next) {
      var sess = req.session;
      if(req.method == 'POST'){
            var address_data={'state_id':req.body.state,'city_id':req.body.city,'zip_code':req.body.zip,'phone_no':req.body.phone_no,'email_id':req.body.email}; //addressModel
            
            addressModel.forge(address_data)
            .save()
            .then(function (model) {
              if(model){
                var saved_address_data=model.toJSON();
                var restaurant_data={'full_name':req.body.full_name,'user_type':3,'parent_id':req.body.foodcourt,'address_id':saved_address_data.id,'email':req.body.email,'password':req.body.password,'phone_no':req.body.phone_no}; 
                
                usersModel.forge(restaurant_data)
                .save()
                .then(function (restaurant){
                  if(restaurant){
                    res.redirect('/portal/restaurants');
                  } else {
                    res.redirect('/portal/restaurants');
                  }
                });
                
              } else {
                res.redirect('/portal/restaurants');
              }
              //res.redirect('/portal/restaurants');
            })
            .catch(function (error) {
              res.redirect('/portal/restaurants');
            });
      } else {
        res.render('restaurant/restaurant_add',{'SessionData':sess});
      }
  },
  
  // GET or POST /portal/restaurant/edit
   edit_restaurant: function(req, res, next) {
     var restaurant_id= req.params.id;
      var sess = req.session;
      if(req.method == 'POST'){
            restaurantsModel.forge({id:restaurant_id,})
            .fetch()
            .then(function (is_restaurant){
              if(is_restaurant){
                var address_data={'state_id':req.body.state,'city_id':req.body.city,'zip_code':req.body.zip,'phone_no':req.body.phone_no,'email_id':req.body.email}; //addressModel
                    addressModel.forge({id:is_restaurant.address_id})
                    .fetch()
                    .then(function (is_address){
                        is_address.save(address_data).then(function (){
                          var restaurant_data={'full_name':req.body.full_name,'user_type':3,'parent_id':req.body.foodcourt,'address_id':is_restaurant.address_id,'email':req.body.email,'password':req.body.password,'phone_no':req.body.phone_no}; 
                          is_restaurant.save(restaurant_data).then(function (){
                            res.redirect('/portal/restaurants');
                          });
                      
                        });
                    })
                    .catch(function (error) {
                      res.redirect('/portal/restaurants');
                    });
              } else {
                res.redirect('/portal/restaurants');
              }
            });
      } else {
        if(restaurant_id!=""){
           restaurantsModel.forge({id:restaurant_id,})
            .fetch({withRelated: ['addresses','addresses.state','addresses.city']})
            .then(function (model){
              var contex = {};
              if(model){
                var context = {
                  restaurants: model.toJSON(),
                  'SessionData':sess,
                };
                res.render('restaurant/restaurant_edit', context);
              } else {
               res.redirect('/portal/restaurants');
              }
            });
          } else{
            res.redirect('/portal/restaurants');
          }
      }
  },
  
  
  
  
};
