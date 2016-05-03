var foodcourtsModel = require('../models/foodcourtsModel');
var statesModel = require('../models/statesModel');
var citiesModel = require('../models/citiesModel');
var addressModel = require('../models/addressModel');


module.exports = {
  // GET /StateList/
  getStates: function(req, res, next){
    statesModel.fetchAll()
    .then(function (model) {
      response = {};
      if(model){
        response = {
          data: model.toJSON(),
          message: 'State List',
          status: 'success',
          code: '1007'
        };
      } else {
        response = {
          message: 'No State Found',
          status: 'success',
          code: '1007'
        };
      }
      res.json(response);
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message});
    });
  },
  // GET /Cities/
  getCities: function(req, res, next){
    var id=req.params.id;
    citiesModel.where({state_id:id})
    .fetchAll()
    .then(function (model) {
      response = {};
      if(model){
        response = {
          data: model.toJSON(),
          message: 'Citiy List',
          status: 'success',
          code: '1007'
        };
      } else {
        response = {
          message: 'No City Found',
          status: 'success',
          code: '1007'
        };
      }
      res.json(response);
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message});
    });
  },
  // ADD /Foodcourt/
  addFoodcourt: function(req, res, next) {
    var formPostData=req.body;
    var foodcouertSaveData={
      'full_name':formPostData.full_name,'email':formPostData.email,'password':formPostData.password,'phone_no':formPostData.phone_no,'user_type':'2','parent_id':'0','facebook_id':0,'address_id':'0'
    };
    var foodCourtAddress={
      'country_id':'1','state_id':formPostData.state_id,'city_id':formPostData.city_id,'zip_code':formPostData.zip_code,'phone_no':formPostData.phone_no,'email_id':formPostData.email,'status':'1'
    };
    foodcourtsModel.forge(foodcouertSaveData).save().then(function(model){
      if(model){
          var getRtnOnSave=model.toJSON();
          addressModel.forge(foodCourtAddress).save().then(function(addressmodel){
            if(addressmodel){
              var getRtnOnSaveAddress=addressmodel.toJSON();
              //foodcourtsModel.where({'id':getRtnOnSave.id}).save({'address_id':getRtnOnSaveAddress.id},{patch: true}).then(function(addressupdate){});
              foodcourtsModel.forge({id:getRtnOnSave.id})
              .fetch()
              .then(function (model){
                model.save({'address_id':getRtnOnSaveAddress.id})
                .then(function(){
                  response = {
                    message: 'Record has been saved successfully',
                    status: 'success',
                    code: '1007'
                  };
                  res.json(response);
                });
              })
            }else{
              response = {
                message: 'All the field are required',
                status: 'success',
                code: '1007'
              };
              res.json(response);
            }
          });
      }else{
        response = {
          message: 'All the field are required',
          status: 'success',
          code: '1007'
        };
        res.json(response);
      }
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message});
    });
  },

  // GET /Foodcourt/:id
  getFoodcourt: function(req, res, next) {
    var id = req.params.id;
    foodcourtsModel.forge({id: id,user_type:2})
    .fetch()
    .then(function (model) {
      res.json(foodcourtsModel.toJSON());
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message});
    });
  },
  // GET /Foodcourts
  getFoodcourts: function(req, res, next) {
    foodcourtsModel.where({user_type:2})
    .fetchAll({withRelated: ['addresses','addresses.state','addresses.city']})
    .then(function (model) {
      response = {};
      if(model){
        response = {
          data: model.toJSON(),
          message: 'Foodcourt list',
          status: 'success',
          code: '1007'
        };
      } else {
        response = {
          message: 'no foodcourt found',
          status: 'success',
          code: '1007'
        };
      }
      res.json(response);
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message});
    });
  },
  // Put /Foodcourts/Changestatus
  changeStatus: function(req, res, next) {
    var id = req.body.id;
    var status = req.body.status;
    foodcourtsModel.forge({id:id})
    .fetch()
    .then(function (model) {
      model.save({status: status})
      .then(function(){
        response = {
          message: 'Foodcourt status update successfully.',
          status: 'success',
          code: '2007'
        };
      })
      .catch(function(err){
        response = {
          message: 'Foodcourt status update unsuccessfull.',
          status: 'error',
          code: '2007'
        };
      });

      res.json(response);
    })
    .catch(function (error) {
      res.status(500).json({msg: error.message});
    });
  }
};
