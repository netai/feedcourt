var models = require('../models'),
    utility = require('../helpers/utility');


module.exports = {
  // GET /portal/menues/:id
  menu_list: function(req, res, next) {
    var sess = req.session;
    var context ={};
    var id = req.params.id;
    var foodcourt_id="";
    if(sess.user_type!==undefined && sess.user_type==3){
      id=sess.user_id;
    }
    if(req.params.feedcourt!==undefined){
      foodcourt_id=req.params.feedcourt;
    }
    models.usersModel.forge({id:id})
    .fetch({columns: ['full_name']})
    .then(function (model) {
      if(model){
        var  restaurant_data=model.toJSON();
        models.menusModel.query('orderBy', 'order_sequence', 'asc').where({'restaurant_id':id})
        .where('status','!=',2)
        .fetchAll({withRelated: ['menu_groups','unites',{menu_images: function(query) { query.where({'type':'2','is_default':1}); }}]})
        .then(function (menues_data) {
          if(menues_data){
            context = {
              restaurant:restaurant_data,
              'foodcourt_id':foodcourt_id,
              menues: menues_data.toJSON(),
              'SessionData':sess
            }; 
          } else {
            context = {
              restaurant:restaurant_data,
              'foodcourt_id':foodcourt_id,
              menues: {},
              'SessionData':sess
            }; 
          }
          res.render('restaurant/menu_list', context);
        });
        
      } else {
        context = {
          restaurant:{},
          'foodcourt_id':foodcourt_id,
          menues: {},
          'SessionData':sess
        };
        res.render('restaurant/menu_list', context);
      }
      
    })
    .catch(function (error) {
      res.redirect('/portal/restaurants');
    });
  },
  // All /portal/menu/add
  menu_add: function(req, res, next) {
    var restaurant_id = req.params.id;
    var sess = req.session;
    if(sess.user_type!==undefined && sess.user_type==3){
      restaurant_id=sess.user_id;
    }
    if(req.method == 'POST'){
        restaurant_id = req.body.restaurant_id;
          if(req.body.unit_id<=0){
             models.unitesModel.forge({title: req.body.unit, restaurant_id: req.body.restaurant_id, status: '1'})
            .save()
            .then(function (saveUnit){
              if(saveUnit){
                var new_uint=saveUnit.toJSON();
                models.menusModel.forge({cuisine_id: 0, title: req.body.title, price:req.body.price,unit_id:new_uint.id,description:req.body.description,restaurant_id:restaurant_id,menu_group_id:req.body.menu_group_id,'order_sequence':req.body.order_sequence,status: '1'})
                .save()
                .then(function(saveMenu){
                  if(saveMenu){
                    res.redirect('/portal/menu/'+restaurant_id);
                  }
                  
                });
              }
              
            });
          }
          else if(req.body.unit_id>0){
            models.menusModel.forge({cuisine_id: 0, title: req.body.title, price:req.body.price,unit_id:req.body.unit_id,description:req.body.description,restaurant_id:req.body.restaurant_id,menu_group_id:req.body.menu_group_id,'order_sequence':req.body.order_sequence,status: '1'})
                .save()
                .then(function(saveMenu){
                  if(saveMenu){
                    res.redirect('/portal/menu/'+restaurant_id);
                  }
            });
          }
          else{
            res.redirect('/portal/menu/'+restaurant_id);
          }
    } else {
      res.render('restaurant/menu_add',{'SessionData':sess,'restaurant_id':restaurant_id});
    }
  },
 
  //GET/POST   /portal/edit_menu/:restaurant/:id
  menu_edit: function(req, res, next) {
      var sess = req.session;
      var menu_id=req.params.id;
      var restaurant_id=req.params.restaurant;
      if(sess.user_type!==undefined && sess.user_type==3){
        restaurant_id=sess.user_id;
      }
      var contex={'SessionData':sess};
      if(req.method == 'POST'){
          menu_id=req.body.menu_id;
          restaurant_id=req.body.restaurant_id;
          models.usersModel.forge({id:restaurant_id})
          .fetch()
          .then(function(is_restaurant){
              var restaurant=is_restaurant.toJSON();
              if(req.body.unit_id<=0){
                  models.unitesModel.forge({title: req.body.unit, restaurant_id: restaurant.id, status: '1'})
                  .save()
                  .then(function (saveUnit){
                    if(saveUnit){
                      var new_uint=saveUnit.toJSON();
                      models.menusModel.forge({id:menu_id})
                      .fetch()
                      .then(function(is_menu){
                        var menu=is_menu.toJSON();
                        var updated_menu_data={cuisine_id: '0', title: req.body.title, price:req.body.price,unit_id:new_uint.id,description:req.body.description,restaurant_id:menu.restaurant_id,menu_group_id:req.body.menu_group_id,'order_sequence':req.body.order_sequence, status: menu.status};
                        is_menu.save(updated_menu_data).then(function(){
                          res.redirect('/portal/menu/'+restaurant_id);
                        });
                      });
                    } else {
                      res.redirect('/portal/menu/'+restaurant_id);
                    }
                  });
              } else if(req.body.unit_id>0) {
                models.menusModel.forge({id:menu_id})
                .fetch()
                .then(function(is_menu){
                  var menu=is_menu.toJSON();
                  var updated_menu_data={cuisine_id: '0', title: req.body.title, price:req.body.price,unit_id:req.body.unit_id,description:req.body.description,restaurant_id:menu.restaurant_id,menu_group_id:req.body.menu_group_id,'order_sequence':req.body.order_sequence,status: menu.status};
                  is_menu.save(updated_menu_data).then(function(){
                    res.redirect('/portal/menu/'+restaurant_id);
                  });
                });
            } else {
              res.redirect('/portal/menu/'+restaurant_id);
            }
        });
      } else {
        models.usersModel.forge({id:restaurant_id})
        .fetch()
        .then(function(is_restaurant){
            var restaurant=is_restaurant.toJSON();
            models.menusModel.forge({'id':menu_id})
            .fetch({withRelated: ['menu_groups','unites',{menu_images: function(query) { query.where({'type':'2','is_default':1}); }}]})
            .then(function(is_menu){
              contex={'SessionData':sess,'restaurant':restaurant,'menu':is_menu.toJSON()};
              res.render('restaurant/menu_edit',contex);
            }); 
        });
      }
  },
 
   // GET /portal/menues/:id
  menu_view: function(req, res, next) {
    var sess = req.session;
    var menu_id=req.params.id;
    var restaurant_id=req.params.restaurant;
    if(sess.user_type!==undefined && sess.user_type==3){
      restaurant_id=sess.user_id;
    }
    var contex={'SessionData':sess};
    models.usersModel.forge({id:restaurant_id})
      .fetch()
      .then(function(is_restaurant){
          var restaurant=is_restaurant.toJSON();
          models.menusModel.forge({'id':menu_id})
          .fetch({withRelated: ['menu_groups','unites',{menu_images: function(query) { query.where({'type':'2','is_default':1}); }}]})
          .then(function(is_menu){
            contex={'SessionData':sess,'restaurant':restaurant,'menu':is_menu.toJSON()};
            res.render('restaurant/menue_detail',contex);
          })
          .catch(function (error) {
            res.redirect('/portal/menu/'+menu_id);
          });
      })
      .catch(function (error) { 
        res.redirect('/portal/restaurants');
      });
  },
  
  // Put /Resturant/Changestatus
  change_status: function(req, res, next) {
    var id = req.params.id;
    models.menusModel.forge({id:id})
    .fetch()
    .then(function (model) {
      var status = model.get('status')==1?0:1;
      model.save({status: status})
      .then(function(rtn_data){
        var menus=rtn_data.toJSON();
        res.redirect('/portal/menu/'+menus.restaurant_id);
      })
      .catch(function(error){
        console.log(error.message);
        res.redirect('/portal/restaurants');
      });
    })
    .catch(function (error) {
        console.log(error.message);
        res.redirect('/portal');
    });
  },
  // Put /menu/delete
  menu_delete: function(req, res, next) {
    var id = req.params.id;
    models.menusModel.forge({id:id})
    .fetch()
    .then(function (model) {
      model.save({status: 2})
      .then(function(rtn_data){
        var menu=rtn_data.toJSON();
        res.redirect('/portal/menu/'+menu.restaurant_id);
      })
      .catch(function(error){
        res.redirect('/portal/restaurants');
      });
    })
    .catch(function (error) {
        res.redirect('/portal');
    });
  },
  // portal/menu_images/view/:restaurant/:id  menu images add or edit
  menu_images:function(req,res,next){
    var sess = req.session;
    var context ={};
    var id = req.params.id;
    var restaurant_id=req.params.restaurant;
    if(sess.user_type!==undefined && sess.user_type==3){
      id=sess.user_id;
    }
    if(req.method == 'POST'){
      if(req.file.originalname!=undefined){
        var file_name = utility.getFileName(req.file.originalname);
        utility.saveImageAndThumb(req.file,file_name,function(){
          models.imagesModel.forge({img_name: file_name, type: 2, reference_id:id, added_by: sess.user_id})
          .save()
          .then(function (imgmodel) {
            res.redirect('/portal/menu/'+restaurant_id);
          })
          .catch(function (error) {
            console.log(error.message);
          });
        }); 
      }
    } else {
      models.imagesModel.where({reference_id:id,type:'2'})
      .fetchAll()
      .then(function (menu_images){
            context={'SessionData':sess,'menu_images':menu_images.toJSON(),'menu_id':id,'restaurant_id':restaurant_id};
            res.render('restaurant/menu_images_view',context);
      });
    }
  },
   // POST /portal/menu_images/default
  default_image_status: function(req, res, next){
    var context = {status: 'error'};
    if(req.method=='POST'){
       var id=req.body.id;
      models.imagesModel.where({id:id})
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
  
  
  // POST /portal/menu_images/delete
  delete_image: function(req, res, next){
    var context = {status: 'error'};
     if(req.method=='POST'){
        var fs= require('fs-extra')
      var id=req.body.id;
      models.imagesModel.where({id:id})
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
  
  
  
};
