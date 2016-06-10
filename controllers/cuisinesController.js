var cuisinesModel = require('../models/cuisinesModel');
var fs   = require('fs-extra'),
    path = require('path'),
    util = require('util');
    
module.exports = {
  // GET /portal/cuisine/view/:id
  cuisines_detail: function(req, res, next) {
    var sess = req.session;
    var id = req.params.id;
      cuisinesModel.forge({id:id})
      .fetch()
      .then(function (model) {
          var context = {
            cuisines: model.toJSON(),
            'SessionData':sess
          };
          res.render('cuisines/cuisines_detail', context);
      })
    .catch(function (error) {
      res.send('Sorry somthing is wrong');
      });
  },

  // GET /portal/cuisine
  cuisines_list: function(req, res, next) {
    var sess = req.session;
    cuisinesModel.where('status', '!=', '2')
    .fetchAll()
    .then(function (model) {
      if(model){
        var context = {
          cuisines: model.toJSON(),
          'SessionData':sess
        };
      } else {
        context = {
          cuisines: {},
          'SessionData':sess
        };
      }

      res.render('cuisines/cuisines_list', context);
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message});
    });
  },
  
  // Put /cuisine/Changestatus
  change_status: function(req, res, next) {
    var id = req.params.id;
    cuisinesModel.forge({id:id})
    .fetch()
    .then(function (model) {
      var status = model.get('status')==1?0:1;
      model.save({status: status})
      .then(function(){
        res.redirect('/portal/cuisines');
      })
      .catch(function(error){
        console.log(error.message);
        res.redirect('/portal');
      });
    })
    .catch(function (error) {
        console.log(error.message);
        res.redirect('/portal');
    });
  },
  
  
  // Put /cuisine/delete
  cuisines_delete: function(req, res, next) {
    var id = req.params.id;
    cuisinesModel.forge({id:id})
    .fetch()
    .then(function (model) {
      model.save({status: 2})
      .then(function(){
        res.redirect('/portal/cuisines');
      })
      .catch(function(error){
        console.log(error.message);
        res.redirect('/portal');
      });
    })
    .catch(function (error) {
        console.log(error.message);
        res.redirect('/portal');
    });
  },
  
  // POST /portal/cuisine/add
  add_cuisines: function(req, res, next) {
     var sess = req.session;
    if(req.method == 'POST'){
          cuisinesModel.forge({'title':req.body.title,'description':req.body.description,'status':'1'})
          .save()
          .then(function (model){
            if(model){
              res.redirect('/portal/cuisines');
            } else {
              res.render('cuisines/cuisines_add');
            }
          });
    } else {
      res.render('cuisines/cuisines_add',{'SessionData':sess});
    }
  },
  
   // POST /portal/cuisine/edit
  edit_cuisines: function(req, res, next) {
      var sess = req.session;
      var cuisine_id=req.params.id;
      var contex={};
      if(req.method == 'POST'){
          cuisine_id=req.body.cuisin_id;
          cuisinesModel.forge({id:cuisine_id})
          .fetch()
          .then(function (is_cuisines){
            if(is_cuisines){
              var cuisine_data=is_cuisines.toJSON();
              is_cuisines.save({'title':req.body.title,'description':req.body.description,'status':cuisine_data.status}).then(function(){
                res.redirect('/portal/cuisines');
              });
            } else {
              res.render('cuisines/cuisines_edit',{'SessionData':sess});
            }
          });
      } else if(cuisine_id>0) {
        cuisinesModel.forge({id:cuisine_id})
        .fetch()
        .then(function (model){
          contex={'cuisin':model.toJSON(),'SessionData':sess};
           res.render('cuisines/cuisines_edit',contex);
        });
       
      } else {
        res.render('cuisines/cuisines_edit',{'SessionData':sess});
      }
  },
  
  
  
};
