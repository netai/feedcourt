var models = require('../models');

var config = require('../config/app');

module.exports = {
    // GET /
  home: function(req, res, next){
    var sess = req.session;
    res.render('site/home',{});
  },
  // GET /portal
  dashboard: function(req, res, next){
    var sess = req.session;
    res.render('site/dashboard',{'SessionData':sess});
  },
  // ALL /portal/login
  portal_login: function(req, res, next) {
    var sess = req.session;
    if(sess.is_login){
      res.redirect('/portal');
    } else {
        if(req.method == 'POST'){
        var email = req.body.email;
        var password = req.body.password;
        models.usersModel.where({'email':email,'password':password,'status':'1'})
        .where('user_type','!=','4')
        .fetch()
        .then(function (model) {
          if(model){
            sess.user_id = model.id;
            sess.user_type = model.get('user_type');
            sess.name = model.get('full_name');
            sess.email = model.get('email');
            sess.is_login = true;
            res.redirect('/portal');
          } else {
            var context = {
              error: 'Wrong email/password',
              sess: req.session
            };
            res.render('site/login', context);
          }
        })
        .catch(function (error) {
          console.log(error.message);
          res.redirect('/portal/login');
        });
      } else {
        res.render('site/login', {error:''});
      }
    }
  },
  
  edit_profile:function(req,res,next){
    var sess=req.session;
    var contex={};
    if(typeof sess.user_id!=undefined && sess.user_id!=""){
      if(req.method=='POST'){
        models.usersModel.forge({id:sess.user_id})
        .fetch()
        .then(function(is_profile_data){
            var profile_data=is_profile_data.toJSON();
            var update_profile_data={'full_name':req.body.name,'user_type':profile_data.user_type,'parent_id':profile_data.parent_id,'address_id':profile_data.address_id,'email':req.body.email,'password':profile_data.password,'phone_no':req.body.phone};
            is_profile_data.save(update_profile_data).then(function(){
                models.addressModel.forge({id:profile_data.address_id})
                .fetch()
                .then(function(is_address){
                    var address_data={'state_id':req.body.state,'city_id':req.body.city,'zip_code':req.body.zip,'phone_no':req.body.phone,'email_id':req.body.email}; 
                    is_address.save(address_data).then(function(){
                      res.redirect('/portal/profile');
                    })
                    .catch(function (error) {
                      console.log(error.message);
                      res.redirect('/portal');
                    });
                })
                .catch(function (error) {
                    console.log(error.message);
                    res.redirect('/portal');
                });
            });
        }).catch(function (error) {
          console.log(error.message);
          res.redirect('/portal/profile');
        });
        
      } else{
        models.usersModel.forge({id:sess.user_id})
        .fetch({withRelated: ['addresses','addresses.state','addresses.city']})
        .then(function(profile_data){
          contex={'profile':profile_data.toJSON(),'SessionData':sess,'error':''};
          res.render('site/edit_profile',contex);
        })
        .catch(function (error) {
          console.log(error.message);
          res.redirect('/portal');
        });
      }
      
    } else {
      res.redirect('/portal');
    }
  },

  // ALL /portal/changepassword
  change_password: function(req, res, next) {
        var sess = req.session;
        if(req.method == 'POST'){
        var opassword = req.body.opassword;
        var npassword = req.body.npassword;
        models.usersModel.forge({password: opassword,id: sess.user_id})
        .fetch()
        .then(function (model) {
          if(model){
            model.save({password: npassword})
            .then(function(){
              res.redirect('/portal/changepassword');
            })
            .catch(function(error){
              console.log(error.message);
              res.redirect('/portal');
            });
          } else {
            var context = {
              error: 'Wrong Old Password',
              'SessionData':sess,
            };
            res.render('site/change_password', context);
          }
        })
        .catch(function (error) {
          console.log(error.message);
          res.redirect('/portal');
        });
      } else {
        res.render('site/change_password', {error:'','SessionData':sess});
      }

  },
  //GET /portal/logout
  portal_logout: function(req, res, next){
    req.session.destroy();
    res.redirect('/portal/login');
  },
  // GET /StateList/
  state_list: function(req, res, next){
    models.statesModel.fetchAll()
    .then(function (model) {
      var context = {};
      if(model){
        context = {
          state: model.toJSON(),
        };
      } else {
        context = {
          state: {},
        };
      }
      res.json(context);
    })
    .catch(function (error) {
      var context = {
          state: {},
          message: error.message,
          status: 'error',
        };
        res.json(context);
    });
  },
  // GET /Cities/
  city_list: function(req, res, next){
    var id=req.params.id;
    var conditions={'state_id':id,'is_selected':'1'};
    if(req.params.is_selected!==null || req.params.is_selected!==undefined){
        conditions={'state_id':id,'is_selected':req.params.is_selected};
    }
    models.citiesModel.where(conditions)
    .fetchAll()
    .then(function (model) {
      var context = {};
      if(model){
        context = {
          city: model.toJSON(),
        };
      } else {
        context = {
          city: {},
        };
      }
      res.json(context);
    })
    .catch(function (error) {
      var context = {
          city: {},
          message: error.message,
          status: 'error',
        };
        res.json(context);
    });
  },
  // GET /Foodcourt List/
  foodcourt_list: function(req, res, next){
    //var id=req.params.id;
    models.usersModel.where({status:'1',user_type:'2'}) 
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
  // GET /cusine list/
  cuines_list: function(req, res, next){
    //var id=req.params.id;
    models.cuisinesModel.where({status:'1'}) 
    .fetchAll({columns:['id','title']})
    .then(function (model) {
      var context = {};
      if(model){
        context = {
          cuisines: model.toJSON(),
        };
      } else {
        context = {
          cuisines: {},
        };
      }
      res.json(context);
    })
    .catch(function (error) {
      var context = {
          cuisines: {},
          message: error.message,
          status: 'error',
        };
        res.json(context);
    });
  },
  // GET /Unit list/
  unit_list: function(req, res, next){
   var title=req.query.term;
    models.unitesModel.where({'status':'1'})
    .where('title', 'LIKE', '%'+title+'%')
    .fetchAll({columns:['id','title']})
    .then(function (model) {
      var unit_list=[];
      if(model){
        var unit_arr= model.toArray();
        unit_arr.forEach(function(row,idx){
          unit_list[idx]={value: row.get('title'), id: row.get('id') };
        });
      }
      res.json(unit_list);
    })
    .catch(function (error) {
      var context = {
          unit: {},
          message: error.message,
          status: 'error',
        };
        res.json(context);
    });
  },
  // GET /menu list/
  menu_list: function(req, res, next){
   var restaurant_id= req.body.restaurant_id;
   var title_menu=req.body.menu;
    models.menusModel.where({'restaurant_id':restaurant_id,'status':'1'})
    .where('title', 'LIKE', '%'+title_menu+'%')
    .fetchAll({columns:['id','title']})
    .then(function (model) {
      var menu_list={};
      if(model){
        var menu_list= model.toJSON();
         
      } 
      res.json(menu_list);
    })
    .catch(function (error) {
      var context = {};
        res.json(context);
    });
  },
  // GET /emailexist/
  email_exist: function(req, res, next){
    var email=req.body.email;
    if(typeof req.body.id!=undefined && req.body.id!=null && req.body.id!=""){
      models.usersModel.where({'email':email, facebook_id:0})
      .where('id','!=', req.body.id)
      .fetch()
      .then(function (model) {
          var context = {};
          if(model){
            context = {
              message: 'email exist',
              status: true
            };
          } else {
            context = {
              message: 'email not exist',
              status: false
            };
          }
          res.json(context);
        })
        .catch(function (error) {
          var context = {
              city: {},
              message: error.message,
              status: 'error',
            };
            res.json(context);
        });
      
      
    } else {
      
        models.usersModel.where({email:email,facebook_id:0})
        .fetch()
        .then(function (model) {
          var context = {};
          if(model){
            context = {
              message: 'email exist',
              status: true
            };
          } else {
            context = {
              message: 'email not exist',
              status: false
            };
          }
          res.json(context);
        })
        .catch(function (error) {
          var context = {
              city: {},
              message: error.message,
              status: 'error',
            };
            res.json(context);
        });
          
    }
  },
  
  mail_test : function(req, res, next){
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
res.render('mail/test.ejs', {msg: 'just test'}, function(err, html){
  if(err){
    console.log(err);
  } else {
      var transport = nodemailer.createTransport(smtpTransport(config.mail.smtp));

      var mailOptions={
          from : config.mail.form_mail,
          to : "achinta.achinta@gmail.com",
          subject : "Your Subject",
          html : html,
      }

      transport.sendMail(mailOptions, function(error, response){
          if(error){
              console.log(error);
              res.end("error");
          }else{
              console.log(response.response.toString());
              console.log("Message sent: " + response.message);
              res.end("sent");
          }
      });
  }
});
  },
  
  
};
