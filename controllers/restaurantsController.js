var restaurantsModel =require('../models/restaurantsModel');
var foodcourtsModel =require('../models/foodcourtsModel');
var citiesModel =require('../models/citiesModel');
var addressModel =require('../models/addressModel');
var usersModel =require('../models/usersModel');
var menusModel =require('../models/menusModel');
var imagesModel =require('../models/imagesModel');
var utility = require('../helpers/utility');

module.exports = {
  // GET /portal/restaurants/view/:id
  restaurants_detail: function(req, res, next) {
    var sess = req.session;
    var id = req.params.id;
    if(typeof sess.user_type!='undefined' && sess.user_type=='3'){
        restaurantsModel.forge({id:sess.user_id})
        .fetch({withRelated: ['addresses','addresses.state','addresses.city',{images: function(query) { query.where({'type':'1','is_default':1}); }}]})
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
      .fetch({withRelated: ['addresses','addresses.state','addresses.city',{images: function(query) { query.where({'type':'1','is_default':1}); }}]})
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
    var context = {'SessionData':sess};
    if(typeof sess.user_type!='undefined' && sess.user_type=='3'){
      res.redirect('/portal');
    }
     var foodcourt_id ="";
     if(req.params.foodcourt_id!==undefined){
       foodcourt_id=req.params.foodcourt_id;
     }

    if(typeof sess.user_type!='undefined' && sess.user_type=='2'){
        restaurantsModel.query('orderBy', 'id', 'desc').where({'parent_id':sess.user_id,'user_type':'3'})
        .fetchAll({withRelated: ['addresses','addresses.state','addresses.city',{images: function(query) { query.where({'type':'1','is_default':1}); }}]})
        .then(function (model) {
          if(model){
            context = {
              restaurants: model.toJSON(),
              'SessionData':sess,
              'foodcourt_id':foodcourt_id
            };
          } else {
            context = {
              restaurants: {},
              'SessionData':sess,
              'foodcourt_id':foodcourt_id
            };
          }
          res.render('restaurant/restaurant_list', context);
        })
        .catch(function (error) {
          res.status(500).json({msg: error.message});
        });
    } else {
      
      var where_cond={user_type: 3};
      if(foodcourt_id!==""){
        where_cond={'parent_id':foodcourt_id,'user_type': 3};
      }
      
      restaurantsModel.query('orderBy', 'id', 'desc').where(where_cond)
        .fetchAll({withRelated: ['addresses','addresses.state','addresses.city',{images: function(query) { query.where({'type':'1','is_default':1}); }}]})
        .then(function (model) {
          if(model){
            context = {
              restaurants: model.toJSON(),
              'SessionData':sess,
              'foodcourt_id':foodcourt_id
            };
          } else {
            context = {
              restaurants: {},
              'SessionData':sess,
              'foodcourt_id':foodcourt_id
            };
          }
          res.render('restaurant/restaurant_list', context);
        })
        .catch(function (error) {
          res.status(500).json({msg: error.message});
        });
      
    }
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
            var restaurant_data={'full_name':req.body.full_name,'user_type':3,'parent_id':req.body.foodcourt,'email':req.body.email,'password':req.body.password,'phone_no':req.body.phone_no,'contact_person':req.body.contact_person,'description':req.body.description}; 
            usersModel.forge(restaurant_data)
            .save()
            .then(function (model) {
              if(model){
                var saved_restaurant_data=model.toJSON();
                var address_data={'state_id':req.body.state,'city_id':req.body.city,'zip_code':req.body.zip,'phone_no':req.body.phone_no,'email_id':req.body.email,'user_id':saved_restaurant_data.id}; //addressModel
                addressModel.forge(address_data)
                .save()
                .then(function (address){
                  if(address){
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
     var restaurant_id=req.params.id;
      var sess = req.session;
      if(req.method == 'POST'){
          restaurant_id=req.body.restaurant_id;
            restaurantsModel.forge({id:restaurant_id})
            .fetch()
            .then(function (is_restaurant){
              var restaurant_data=is_restaurant.toJSON();
              var update_restaurant_data={'full_name':req.body.full_name,'user_type':3,'parent_id':req.body.foodcourt,'email':restaurant_data.email,'password':restaurant_data.password,'phone_no':req.body.phone_no,'contact_person':req.body.contact_person,'description':req.body.description}; 
              is_restaurant.save(update_restaurant_data).then(function (){
                var address_data={'country_id':'1','state_id':req.body.state,'city_id':req.body.city,'zip_code':req.body.zip,'phone_no':req.body.phone_no,'user_id':restaurant_data.id};
                addressModel.forge({'user_id':restaurant_data.id})
                .fetch()
                .then(function (save_adress){
                  save_adress.save(address_data).then(function(){});
                });
                res.redirect('/portal/restaurants');
              });
            });
      } else {
        if(restaurant_id!=""){
           restaurantsModel.forge({id:restaurant_id})
            .fetch({withRelated: ['addresses','addresses.state','addresses.city',{images: function(query) { query.where({'type':'1','is_default':1}); }}]})
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
  // portal/restaurant_images/view/:id restaurant images add or edit
  resturant_images:function(req,res,next){
    var restaurant_id=req.params.id;
    var sess = req.session;
    var contex={};
    if(req.method == 'POST'){
      if(req.file.originalname!==undefined){
        var file_name = utility.getFileName(req.file.originalname);
        utility.saveImageAndThumb(req.file,file_name,function(){
          imagesModel.forge({img_name: file_name, type: 1, reference_id:restaurant_id, added_by: sess.user_id})
          .save()
          .then(function (imgmodel) {
            res.redirect('/portal/restaurants');
          })
          .catch(function (error) {
            console.log(error.message);
          });
        }); 
      }
    } else {
      imagesModel.where({reference_id:restaurant_id,type:'1'})
      .fetchAll()
      .then(function (restaurant_images){
            contex={'SessionData':sess,'restaurant_images':restaurant_images.toJSON(),'restaurant_id':restaurant_id};
            res.render('restaurant/restaurant_images_view',contex);
      });
    }
  },
  // POST /portal/restaurant_image_status/default
  default_image_status: function(req, res, next){
    var context = {status: 'error'};
    if(req.method=='POST'){
       var id=req.body.id;
      imagesModel.where({id:id})
      .fetch()
      .then(function (model) {
         var defautt_status = model.get('is_default')==1?0:1;
         model.save({is_default: defautt_status})
         .then(function(){
           context = { message:"Image status has been changed successfully",status: 'success',change_status:defautt_status};
            res.json(context);
         })
        .catch(function (error) {
          context = { message: error.message,status: 'error'};
          res.json(context);
        });
      })
      .catch(function (error) {
          context = { message: error.message,status: 'error'};
          res.json(context);
      });
    }
    
  },
  
  
  // POST /portal/restaurant_image/delete
  delete_image: function(req, res, next){
    var context = {status: 'error'};
     if(req.method=='POST'){
        var fs= require('fs-extra')
      var id=req.body.id;
      imagesModel.where({id:id})
      .fetch()
      .then(function (model) {
        var image_name = model.get('img_name');
        model.destroy()
        .then(function(){
          fs.remove('./public/media/images/thumb/'+image_name); //unlink thumb image
          fs.remove('./public/media/images/'+image_name); //unlink main image
          context = { message:"Image status has been deleted successfully",status: 'success'};
            res.json(context);
        })
        .catch(function (error) {
          context = { message: error.message,status: 'error'};
          res.json(context);
        });
      })
      .catch(function (error) {
          context = { message: error.message,status: 'error'};
          res.json(context);
      });
     }
  },
  
  
  // GET /restaurant_list_by_ajax/
  restaurant_list_by_ajax: function(req, res, next){
    //var id=req.params.id;
    usersModel.where({status:'1',user_type:'3'}) 
    .fetchAll({columns:['id','full_name']})
    .then(function (model) {
      var context = {};
      if(model){
        context = {
          foodcourt: model.toJSON(),
        };
      } else {
        context = {
          foodcourt: {},
        };
      }
      res.json(context);
    })
    .catch(function (error) {
      var context = {
          foodcourt: {},
          message: error.message,
          status: 'error',
        };
        res.json(context);
    });
  },
  
};
