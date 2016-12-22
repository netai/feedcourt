var models =require('../models'),
    utility = require('../helpers/utility'),
    fs   = require('fs-extra');
module.exports = {
   menu_group_list: function(req, res, next) {
    var sess = req.session;
    var restaurant_id = req.params.restaurant;
    var foodcourt_id="";
    if(sess.user_type!==undefined && sess.user_type==3){
      restaurant_id=sess.user_id;
    }
    if(req.params.feedcourt!==undefined){
      foodcourt_id=req.params.feedcourt;
    }
    var context ={'restaurant_id':restaurant_id,'foodcourt_id':foodcourt_id,'SessionData':sess};
    models.restaurantsModel.where({'id':restaurant_id})
      .fetchAll({columns: ['id', 'full_name']})
      .then(function (restaurant_data){
        var restaurant=restaurant_data.toJSON();
        models.menugroupsModel.where({'restaurant_id':restaurant_id})
        .where('status','!=',2)
        .orderBy('name')
        .fetchAll({withRelated: [{menu_group_images: function(query) { query.where({'type':'3','is_default':1}); }}]})
        .then(function (model){
          context={menu_group: model.toJSON(),'restaurant':restaurant,'foodcourt_id':foodcourt_id,'SessionData':sess}; 
          res.render('menu_group/menu_group_list',context);
        })
        .catch(function (error) {
          res.redirect('/portal/');
        });
      })
      .catch(function (error) {
        res.redirect('/portal/restaurant');
      });
  },
  //Add /portal/menu_group_add
  menu_group_add: function(req, res, next) {
    var sess = req.session;
    var restaurant_id = req.params.restaurant;
    if(sess.user_type!==undefined && sess.user_type==3){
      restaurant_id=sess.user_id;
    }
    var context ={'restaurant_id':restaurant_id,'SessionData':sess};
    if(req.method == 'POST'){
      restaurant_id=req.body.restaurant_id;
      context ={'SessionData':sess,'restaurant_id':restaurant_id};
      models.menugroupsModel.forge({name:req.body.name,description:req.body.description, status: '1','restaurant_id':restaurant_id})
      .save()
      .then(function (insertgroup){
        if(insertgroup){
          var inserted_group_data=insertgroup.toJSON();
          if(req.file!==undefined){
              var file_name = utility.getFileName(req.file.originalname);
              utility.saveImageAndThumb(req.file,file_name,function(){
              models.imagesModel.forge({img_name: file_name, type: 3, reference_id: inserted_group_data.id, added_by: sess.user_id,'is_default':'1'})
              .save()
              .then(function (imgmodel) {})
              .catch(function (error) {
                  console.log(error.message);
              });
            }); 
          }
          res.redirect('/portal/menu_group_list/'+restaurant_id);
        }else{
          console.log('data not save');
        }
      });
    } else {
      res.render('menu_group/menu_group_add',context);
    }
  },
 
  //Add /portal/menu_group_add
  menu_group_edit: function(req, res, next) {
    var group_id= req.params.id;
    var sess = req.session;
    var restaurant_id = req.params.restaurant;
    if(sess.user_type!==undefined && sess.user_type==3){
      restaurant_id=sess.user_id;
    }
    var context ={'SessionData':sess,'group_id':group_id,'restaurant_id':restaurant_id};
    if(req.method == 'POST'){
      restaurant_id=req.body.restaurant_id;
      context ={'SessionData':sess,'group_id':group_id,'restaurant_id':restaurant_id};
      models.menugroupsModel.forge({'id':req.body.group_id,'restaurant_id':restaurant_id})
      .fetch({withRelated: [{menu_group_images: function(query) { query.where({'type':'3','is_default':1}); }}]})
      .then(function (is_menu_group){
        if(is_menu_group){
          var menu_group_data=is_menu_group.toJSON();
        is_menu_group.save({name:req.body.name,description:req.body.description, status:is_menu_group.get('status')}).then(function(){
          if(req.file.originalname!==undefined){
              var file_name = utility.getFileName(req.file.originalname);
              utility.saveImageAndThumb(req.file,file_name,function(){
              if(menu_group_data.menu_group_images[0].id!==undefined){
                models.imagesModel.forge({id:menu_group_data.menu_group_images[0].id})
                .fetch()
                .then(function (menu_group_img){
                  var old_images=menu_group_img.toJSON();
                  is_menu_group.save({img_name: file_name, type:menu_group_img.get('type'), reference_id: menu_group_img.get('reference_id'), added_by: menu_group_img.get('added_by'),'is_default':'1'}).then(function(){
                      fs.remove('./public/media/images/thumb/'+old_images.image_name); //unlink thumb image
                      fs.remove('./public/media/images/'+old_images.image_name); //unlink main image
                  });
                  });
              }else{
                  models.imagesModel.forge({img_name: file_name, type: 3, reference_id: menu_group_data.id, added_by: sess.user_id,'is_default':'1'})
                  .save()
                  .then(function (imgmodel) {})
                  .catch(function (error) {
                    console.log(error.message);
                  });
                }
            }); 
          }
          res.redirect('/portal/menu_group_list/'+restaurant_id);
        });
        }
      });
    } else {
      models.menugroupsModel.forge({id:group_id,'restaurant_id':restaurant_id})
        .fetch({withRelated: [{menu_group_images: function(query) { query.where({'type':'3','is_default':1}); }}]})
        .then(function (model){
          if(model){
            context={menu_group:model.toJSON(),'restaurant_id':restaurant_id,'SessionData':sess};
            res.render('menu_group/menu_group_edit',context);
          } else {
          res.redirect('/portal/menu_group_list/'+restaurant_id);
          }
      });
    }
  },
  
  // GET /portal/menu_group_view/:id
  menu_group_view: function(req, res, next) {
    var group_id= req.params.id;
    var sess = req.session;
    var restaurant_id = req.params.restaurant;
    if(sess.user_type!==undefined && sess.user_type==3){
      restaurant_id=sess.user_id;
    }
    var context ={'SessionData':sess,'restaurant_id':restaurant_id,'group_id':group_id};
    models.menugroupsModel.forge({id:group_id,})
    .fetch({withRelated: [{menu_group_images: function(query) { query.where({'type':'3','is_default':1}); }}]})
    .then(function (model){
      if(model){
        context={menu_group:model.toJSON(),'restaurant_id':restaurant_id,'SessionData':sess};
        res.render('menu_group/menu_group_view',context);
      } else {
      res.redirect('/portal/menu_group_list/'+restaurant_id);
      }
    });
  },
  
  // Put /menu_group_change_status/Changestatus
  menu_group_change_status: function(req, res, next) {
    var id = req.params.id;
    var sess = req.session;
    var restaurant_id = req.params.restaurant;
    if(sess.user_type!==undefined && sess.user_type==3){
      restaurant_id=sess.user_id;
    }
    models.menugroupsModel.forge({'id':id,'restaurant_id':restaurant_id})
    .fetch()
    .then(function (model) {
      var status = model.get('status')==1?0:1;
      model.save({status: status})
      .then(function(rtn_data){
        var menus=rtn_data.toJSON();
        res.redirect('/portal/menu_group_list/'+restaurant_id);
      })
      .catch(function(error){
        console.log(error.message);
        res.redirect('/portal/menu_group_list/'+restaurant_id);
      });
    })
    .catch(function (error) {
        console.log(error.message);
       res.redirect('/portal/menu_group_list/'+restaurant_id);
    });
  },
  
  // Put /menu_group_delete/:id
  menu_group_delete: function(req, res, next) {
    var id = req.params.id;
    var sess = req.session;
    var restaurant_id = req.params.restaurant;
    if(sess.user_type!==undefined && sess.user_type==3){
      restaurant_id=sess.user_id;
    }
    models.menugroupsModel.forge({'id':id,'restaurant_id':restaurant_id})
    .fetch()
    .then(function (model) {
      model.save({status: 2})
      .then(function(rtn_data){
        var menu=rtn_data.toJSON();
        res.redirect('/portal/menu_group_list/'+restaurant_id);
      })
      .catch(function(error){
        res.redirect('/portal/menu_group_list/'+restaurant_id);
      });
    })
    .catch(function (error) {
        res.redirect('/portal/menu_group_list/'+restaurant_id);
    });
  },
  
  // get /menu_group_list_data
  menu_group_list_data: function(req, res, next){
    var sess = req.session;
    var restaurant_id = req.params.restaurant;
    if(sess.user_type!==undefined && sess.user_type==3){
      restaurant_id=sess.user_id;
    }
    var menu_group={};
    models.menugroupsModel.where({'restaurant_id':restaurant_id})
    .where('status','!=',2)
    .fetchAll({columns:['id','name']})
    .then(function (model) {
      if(model){
        menu_group= model.toJSON();
      } 
      res.json(menu_group);
    })
    .catch(function (error) {
        menu_group = {};
        res.json(menu_group);
    });
  },
};
