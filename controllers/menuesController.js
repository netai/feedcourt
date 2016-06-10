var usersModel = require('../models/usersModel'),
    menuesModel =require('../models/menuesModel'),
    unitesModel =require('../models/unitesModel'),
    utility = require('../helpers/utility');
var fs   = require('fs'),
    path = require('path'),
    util = require('util');

module.exports = {
  // GET /portal/menues/:id
  menu_list: function(req, res, next) {
    var sess = req.session;
    var context ={};
    var id = req.params.id;
    if(sess.user_type!==undefined && sess.user_type==3){
      id=sess.user_id;
    }
    
    usersModel.forge({id:id})
    .fetch({columns: ['full_name']})
    .then(function (model) {
      if(model){
        var  restaurant_data=model.toJSON();
        menuesModel.where({'added_by':id})
        .where('status','!=',2)
        .fetchAll({withRelated: ['cuisines','unites']})
        .then(function (menues_data) {
          if(menues_data){
            context = {
              restaurant:restaurant_data,
              menues: menues_data.toJSON(),
              'SessionData':sess
            }; 
          } else {
            context = {
              restaurant:restaurant_data,
              menues: {},
              'SessionData':sess
            }; 
          }
          res.render('restaurant/menu_list', context);
        });
        
      } else {
        context = {
          restaurant:{},
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
             unitesModel.forge({title: req.body.unit, added_by: req.body.restaurant_id, status: '1'})
            .save()
            .then(function (saveUnit){
              if(saveUnit){
                var new_uint=saveUnit.toJSON();
                menuesModel.forge({cuisine_id: req.body.cuisine, title: req.body.title, price:req.body.price,unit_id:new_uint.id,description:req.body.description,added_by:req.body.restaurant_id, status: '1'})
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
            menuesModel.forge({cuisine_id: req.body.cuisine, title: req.body.title, price:req.body.price,unit_id:req.body.unit_id,description:req.body.description,added_by:req.body.restaurant_id, status: '1'})
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
      var contex={};
      if(req.method == 'POST'){
          menu_id=req.body.menu_id;
          restaurant_id=req.body.restaurant_id;
          usersModel.forge({id:restaurant_id})
          .fetch()
          .then(function(is_restaurant){
              var restaurant=is_restaurant.toJSON();
              if(req.body.unit_id<=0){
                  unitesModel.forge({title: req.body.unit, added_by: restaurant.id, status: '1'})
                  .save()
                  .then(function (saveUnit){
                    if(saveUnit){
                      var new_uint=saveUnit.toJSON();
                      menuesModel.forge({id:menu_id})
                      .fetch()
                      .then(function(is_menu){
                        var menu=is_menu.toJSON();
                        var updated_menu_data={cuisine_id: req.body.cuisine, title: req.body.title, price:req.body.price,unit_id:new_uint.id,description:req.body.description,added_by:menu.added_by, status: menu.status};
                        is_menu.save(updated_menu_data).then(function(){
                          res.redirect('/portal/menu/'+restaurant_id);
                        });
                      });
                    } else {
                      res.redirect('/portal/menu/'+restaurant_id);
                    }
                  });
              } else if(req.body.unit_id>0) {
                menuesModel.forge({id:menu_id})
                .fetch()
                .then(function(is_menu){
                  var menu=is_menu.toJSON();
                  var updated_menu_data={cuisine_id: req.body.cuisine, title: req.body.title, price:req.body.price,unit_id:req.body.unit_id,description:req.body.description,added_by:menu.added_by, status: menu.status};
                  is_menu.save(updated_menu_data).then(function(){
                    res.redirect('/portal/menu/'+restaurant_id);
                  });
                });
            } else {
              res.redirect('/portal/menu/'+restaurant_id);
            }
        });
      } else {
        usersModel.forge({id:restaurant_id})
        .fetch()
        .then(function(is_restaurant){
            var restaurant=is_restaurant.toJSON();
            menuesModel.forge({id:menu_id})
            .fetch()
            .then(function(is_menu){
              var menu=is_menu.toJSON();
               unitesModel.forge({id:menu.cuisine_id})
               .fetch()
               .then(function(is_unit){
                 var unit=is_unit.toJSON();
                 res.render('restaurant/menu_edit',{'SessionData':sess,'restaurant_id':restaurant.id,'menu':menu,'unit':unit});
               });
            });
        });
         
      }
  },
 
   // GET /portal/menues/:id
  menu_view: function(req, res, next) {
    var sess = req.session;
    var context ={};
    var id = req.params.id;
    menuesModel.forge({'id':id})
    .fetch({withRelated: ['cuisines','unites']})
    .then(function (model) {
      if(model){
        var  menues_data=model.toJSON();
        usersModel.forge({'id':id,})
        .fetch({columns: ['full_name']})
        .then(function (restaurant_data) {
          if(restaurant_data){
            context = {
              restaurant:restaurant_data.toJSON(),
              menues: menues_data,
              'SessionData':sess
            }; 
          } else {
            context = {
              restaurant:{},
              menues:menues_data,
              'SessionData':sess
            }; 
          }
          res.render('restaurant/menue_detail', context);
        });
        
      } else {
        context = {
          restaurant:{},
          menues: {},
          'SessionData':sess
        };
        res.render('restaurant/menue_detail', context);
      }
      
    })
    .catch(function (error) {
      res.redirect('/portal/restaurants');
    });
  },
  // Put /Resturant/Changestatus
  change_status: function(req, res, next) {
    var id = req.params.id;
    menuesModel.forge({id:id})
    .fetch()
    .then(function (model) {
      var status = model.get('status')==1?0:1;
      model.save({status: status})
      .then(function(rtn_data){
        var menus=rtn_data.toJSON();
        res.redirect('/portal/menu/'+menus.added_by);
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
    menuesModel.forge({id:id})
    .fetch()
    .then(function (model) {
      model.save({status: 2})
      .then(function(rtn_data){
        var menu=rtn_data.toJSON();
        res.redirect('/portal/menu/'+menu.added_by);
      })
      .catch(function(error){
        res.redirect('/portal/restaurants');
      });
    })
    .catch(function (error) {
        res.redirect('/portal');
    });
  },
  
  
  
};
