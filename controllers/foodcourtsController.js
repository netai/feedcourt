var foodcourtsModel = require('../models/foodcourtsModel'),
    statesModel = require('../models/statesModel'),
    citiesModel = require('../models/citiesModel'),
    addressModel = require('../models/addressModel'),
    restaurantsModel = require('../models/restaurantsModel'),
    usersModel = require('../models/usersModel'),
    imagesModel = require('../models/imagesModel'),
    utility = require('../helpers/utility'),
    fs   = require('fs-extra');

module.exports = {
  // GET /portal/restaurants
  restaurant_list: function(req, res, next) {
    var sess = req.session;
    var id = req.params.id;
    if(typeof sess.user_type!=='undefined' && sess.user_type=='2'){
        foodcourtsModel.forge({id: sess.user_id,user_type:2})
        .fetch()
        .then(function (model){
          var foodcourtDetail=model.toJSON();
           restaurantsModel.query('orderBy', 'id', 'desc').where({parent_id: sess.user_id,user_type: 3})
          .fetchAll({withRelated: ['addresses','addresses.state','addresses.city',{images: function(query) { query.where({'type':'1','is_default':1}); }}]})
          .then(function (restaurant) {
            var context = {};
            if(restaurant){
              context = {
                foodcourt:foodcourtDetail,
                restaurants: restaurant.toJSON(),
                'SessionData':sess,
                message: 'Foodcourt list',
                status: 'success',
              };
            } else {
              context = {
                foodcourt:{},
                restaurants:{},
                'SessionData':sess,
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
    } else{
        foodcourtsModel.forge({id: id,user_type:2})
        .fetch()
        .then(function (model){
          var foodcourtDetail=model.toJSON();
           restaurantsModel.query('orderBy', 'id', 'desc').where({parent_id: id,user_type: 3})
          .fetchAll({withRelated: ['addresses','addresses.state','addresses.city',{images: function(query) { query.where({'type':'1','is_default':1}); }}]})
          .then(function (restaurant) {
            var context = {};
            if(restaurant){
              context = {
                foodcourt:foodcourtDetail,
                restaurants: restaurant.toJSON(),
                'SessionData':sess,
                message: 'Foodcourt list',
                status: 'success',
              };
            } else {
              context = {
                foodcourt:{},
                restaurants:{},
                'SessionData':sess,
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
    }
  },
  // GET portal/foodcourts
  foodcourt_list: function(req, res, next) {
    var sess = req.session;
    var id = req.params.id;
    if(typeof sess.user_type !='undefined' && sess.user_type!=1){
      res.redirect('/portal');
    }
    foodcourtsModel.query('orderBy', 'id', 'desc').where({user_type:2})
    .fetchAll({withRelated: ['addresses','addresses.state','addresses.city',{images: function(query) { query.where({'type':'1','is_default':1}); }}]})
    .then(function (model) {
      var context = {};
      if(model){
        context = {
          foodcourt: model.toJSON(),
          'SessionData':sess,
          message: 'Foodcourt list',
          status: 'success',
        };
      } else {
        context = {
          foodcourt:{},
          'SessionData':sess,
          message: 'no foodcourt found',
          status: 'success',
        };
      }
      res.render('foodcourt/foodcourt_list',context);
    })
    .catch(function (error) {
      var context = {
            foodcourt:{},
            'SessionData':sess,
            message: error.message,
            status: 'error',
        };
      res.render('foodcourt/foodcourt_list',context);
    });
  },
    // GET portal/foodcourt_view/:id
  foodcourt_detail: function(req, res, next) {
    var sess = req.session;
    var id = req.params.id;
    var context = {'SessionData':sess};
    foodcourtsModel.forge({id: id,user_type:2})
    .fetch({withRelated: ['addresses','addresses.state','addresses.city',{images: function(query) { query.where({'type':'1','is_default':1}); }}]})
    .then(function (model) {
      context ={'SessionData':sess, 'foodcourt': model.toJSON()};
      res.render('foodcourt/foodcourt_detail',context);
    })
    .catch(function (error) {
     var context = {foodcourt:{},'SessionData':sess};
      res.render('foodcourt/foodcourt_detail',context);
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
    var sess = req.session;
    if(req.method == 'POST'){
      var req_data = {
      email: req.body.email,
      full_name: req.body.full_name,
      password: req.body.password,
      phone_no: req.body.phone_no,
      contact_person:req.body.contact_person,
      user_type: 2,
      status: 1
      }
     usersModel .forge(req_data)
      .save()
      .then(function (save_feedcourt){
        var save_feedcourt_resp=save_feedcourt.toJSON();
        var address_data={
        'state_id': req.body.state,
        'city_id': req.body.city,
        'zip_code': req.body.zip,
        'phone_no': req.body.phone_no,
        'email_id': req.body.email,
        'user_id':save_feedcourt_resp.id
        }
        addressModel.forge(address_data)
        .save()
        .then(function (model) {
           if(req.file.originalname!==undefined){
              var file_name = utility.getFileName(req.file.originalname);
              utility.saveImageAndThumb(req.file,file_name,function(){
              imagesModel.forge({img_name: file_name, type: 1, reference_id: save_feedcourt_resp.id, added_by: sess.user_id,'is_default':'1'})
              .save()
              .then(function (imgmodel) {})
              .catch(function (error) {
                console.log(error.message);
              });
          }); 
          }
          res.redirect('/portal/foodcourts');
        })
        .catch(function (error) {
          console.log(error.message);
          res.redirect('/portal/foodcourts');
        });
      })
      .catch(function (error) {
        console.log(error.message);
        res.redirect('/portal/foodcourts');
      });
    } else {
      res.render('foodcourt/foodcourt_add',{'SessionData':sess});
    }
  },
  
  // GET or POST /portal/restaurant/edit
   edit_foodcourt: function(req, res, next) {
     var foodcourt_id= req.params.id;
      var sess = req.session;
       if(req.method == 'POST'){
            foodcourtsModel.forge({id:req.body.foodcourt_id})
            .fetch()
            .then(function (is_foodcourt){
              if(is_foodcourt){
               var foodcourt_data=is_foodcourt.toJSON();
               var save_foodcourt_data={'full_name':req.body.full_name,'user_type':2,'parent_id':'0','email':foodcourt_data.email,'password':foodcourt_data.password,'phone_no':req.body.phone_no,'contact_person':req.body.contact_person};
                is_foodcourt.save(save_foodcourt_data).then(function (model){
                  foodcourt_data=model.toJSON();
                 var address_data={'state_id':req.body.state,'city_id':req.body.city,'zip_code':req.body.zip,'phone_no':req.body.phone_no,'email_id':foodcourt_data.email,'user_id':foodcourt_data.id}; //addressModel
                 addressModel.forge({'user_id':foodcourt_data.id})
                .fetch()
                .then(function (save_adress){
                  save_adress.save(address_data).then(function(){});
                });
                 if(req.file.originalname!==undefined){
                    var file_name = utility.getFileName(req.file.originalname);
                    utility.saveImageAndThumb(req.file,file_name,function(){
                    
                     imagesModel.forge({reference_id: foodcourt_data.id})
                    .fetch()
                    .then(function (is_image){
                      var old_images=is_image.toJSON();
                      if(is_image){
                        is_image.save({img_name: file_name,type:1,added_by: sess.user_id,'is_default':'1'}).then(function(imgmodel){
                          fs.remove('./public/media/images/thumb/'+old_images.image_name); //unlink thumb image
                          fs.remove('./public/media/images/'+old_images.image_name); //unlink main image
                        })
                        .catch(function (error){
                            console.log(error.message);
                        });
                      } else{
                        imagesModel.forge({img_name: file_name, type: '1', reference_id: foodcourt_data.id, added_by: sess.user_id,'is_default':'1'})
                        .save()
                        .then(function (imgmodel) {})
                        .catch(function (error) {
                          console.log(error.message);
                        });
                      }
                    })
                  }); 
                }
                  res.redirect('/portal/foodcourts');
                }).catch(function (error) {
                  res.redirect('/portal/foodcourts');
                });
              } else {
                res.redirect('/portal/foodcourts');
              }
            });
      } else {
        if(foodcourt_id!=""){
           foodcourtsModel.forge({id:foodcourt_id,})
            .fetch({withRelated: ['addresses','addresses.state','addresses.city',{images: function(query) { query.where({'type':'1','is_default':1}); }}]})
            .then(function (model){
              var contex = {};
              if(model){
                var context = {
                  foodcourts: model.toJSON(),
                  'SessionData':sess,
                };
                res.render('foodcourt/foodcourt_edit', context);
              } else {
               res.redirect('/portal/foodcourts');
              }
            });
          } else{
            res.redirect('/portal/restaurants');
          }
      }
  },
  
  
};
