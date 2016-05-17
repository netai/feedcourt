var foodcourtsModel = require('../models/foodcourtsModel'),
    statesModel = require('../models/statesModel'),
    citiesModel = require('../models/citiesModel'),
    addressModel = require('../models/addressModel'),
    restaurantsModel = require('../models/restaurantsModel'),
    formidable = require('formidable'),
    fs   = require('fs-extra'),
    path = require('path'),
    util = require('util');

module.exports = {
  // GET /portal/restaurants
  restaurant_list: function(req, res, next) {
    var id = req.params.id;
    foodcourtsModel.forge({id: id,user_type:2})
    .fetch()
    .then(function (model){
      var foodcourtDetail=model.toJSON();
       restaurantsModel.where({parent_id: id,user_type: 3})
      .fetchAll({withRelated: ['addresses','addresses.state','addresses.city']})
      .then(function (restaurant) {
        var context = {};
        if(restaurant){
          context = {
            foodcourt:foodcourtDetail,
            restaurants: restaurant.toJSON(),
            message: 'Foodcourt list',
            status: 'success',
          };
        } else {
          context = {
            foodcourt:{},
            restaurants:{},
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
  },
  // GET portal/foodcourts
  foodcourt_list: function(req, res, next) {
    var id = req.params.id;
    foodcourtsModel.where({user_type:2})
    .fetchAll({withRelated: ['addresses','addresses.state','addresses.city']})
    .then(function (model) {
      var context = {};
      if(model){
        context = {
          data: model.toJSON(),
          message: 'Foodcourt list',
          status: 'success',
        };
      } else {
        context = {
          data:{},
          message: 'no foodcourt found',
          status: 'success',
        };
      }
      res.render('foodcourt/foodcourt_list',{'dataJsonArr':context});
    })
    .catch(function (error) {
      var context = {
            data:{},
            message: error.message,
            status: 'error',
        };
      res.render('foodcourt/foodcourt_list',{'dataJsonArr':context});
    });
  },
    // GET portal/foodcourt_view/:id
  foodcourt_detail: function(req, res, next) {
    var id = req.params.id;
    foodcourtsModel.forge({id: id,user_type:2})
    .fetch({withRelated: ['addresses','addresses.state','addresses.city']})
    .then(function (model) {
     var context = {};
      if(model){
        context = {
          data: model.toJSON(),
          message: 'Foodcourt Detail',
          status: 'success',
        };
      } else {
        context = {
          data:{},
          message: 'no foodcourt found',
          status: 'success',
        };
      }
      res.render('foodcourt/foodcourt_detail',{'dataJsonArr':context});
    })
    .catch(function (error) {
     var context = {
            data:{},
            message: error.message,
            status: 'error',
            code: '2005'
      };
      res.render('foodcourt/foodcourt_detail',{'dataJsonArr':context});
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
    if(req.method == 'POST'){
      var form = new formidable.IncomingForm();
      form.parse(req, function(err, fields, files) {
        if(err){
          console.log(err);
        } else {
          res.writeHead(200, {'content-type': 'text/plain'});
          res.write('received upload:\n\n');
          console.log(fields);
          res.end(util.inspect({fields: fields, files: files}));
        }
      });
          // form.on('end', function() {
          //   var temp_path = this.openedFiles[0].path;
          //   var file_name = this.openedFiles[0].name;
          //   var new_location = path.join(__dirname,'..','public','media','images',file_name);
          //   fs.copy(temp_path, new_location, function(err) {
          //     if (err) {
          //       console.error(err);
          //     } else {
          //       console.log(new_location);
          //     }
          //   });
          // });
      form.on('fileBegin', function(name, file) {
          file.path = path.join(__dirname,'..','public','media','images',file.name);
      });
    } else {
      res.render('foodcourt/foodcourt_add');
    }
  },
};
