var models = require('../models1');
    
module.exports = {
  // GET /portal/reviews/
  cities_list: function(req, res, next) {
    var sess = req.session;
    var context ={'cities':'','SessionData':sess};
    models.citiesModel.query('orderBy', 'state_id', 'ASC').where({'is_selected':'1'})
    .fetchAll({withRelated: ['state']})
    .then(function (model) {
      if(model){
        context={'cities':model.toJSON(),'SessionData':sess};
      } 
       res.render('cities/cities_list', context);
    })
    .catch(function (error) {
      res.redirect('/portal');
    });
  },
  // /portal/city_add:
  city_add:function(req,res,next){
    var sess = req.session;
    var context={'SessionData':sess};
    if(req.method == 'POST'){
      
      models.citiesModel.forge({'id':req.body.city_id})
      .fetch()
      .then(function(is_city){
        is_city.save({'is_selected':'1'})
        .then(function(){
          res.redirect('/portal/cities_list');
        })
        .catch(function(){
          res.redirect('/portal/cities_list');
        })
      })
      .catch(function(error){
        res.redirect('/portal/cities_list');
      });
    }else{
       res.render('cities/city_add');
    }
  },
  city_delete: function(req, res, next) {
    var id = req.params.id;
    models.citiesModel.forge({id:id})
    .fetch()
    .then(function (model) {
      var status = model.get('is_selected')==1?0:1;
      model.save({'is_selected': status})
      .then(function(){
        res.redirect('/portal/cities_list');
      })
      .catch(function(error){
        console.log(error.message);
        res.redirect('/portal/cities_list');
      });
    })
    .catch(function (error) {
        console.log(error.message);
        res.redirect('/portal');
    });
  },
  
};
