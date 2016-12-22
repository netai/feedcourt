var paymentDetailsCollection=require('../collections/paymentDetailsCollection'),
orderDetailsCollection = require('../collections/orderDetailsCollection'),
models = require('../models');
module.exports = {
  // POST /makeOrder/:id
  makeOrder: function(req, res, next) {
    var body = ""; // request body
    var response = {message: 'Pelese select a item to make order',status: 'error',code: '8001'};
    req.on('data', function(data) {
      body=JSON.parse(data);
    });
    req.on('end', function() {
      //console.log(body);
      if(body!=""){
        
        var billing_address_data="";
        var shipping_address_data="";
        var billing_address_id="0";
        var shipping_address_id="0";
        if(body.address.billing_address.address_id!==undefined){
          if(body.address.billing_address.address_id=="" || body.address.billing_address.address_id==null){
            billing_address_data={
              'state_id':body.address.billing_address.state_id,
              'city_id':body.address.billing_address.city_id,
              'zip_code':body.address.billing_address.zip_code,
              'phone_no':body.address.billing_address.phone_no,
              'email_id':body.address.billing_address.email_id
            };
          }else{
            billing_address_id=body.address.billing_address.address_id;
          }
        }
        if(body.address.shipping_address.address_id!==undefined){
          if(body.address.shipping_address.address_id=="" || body.address.shipping_address.address_id==null){
            shipping_address_data={
              'state_id':body.address.billing_address.state_id,
              'city_id':body.address.billing_address.city_id,
              'zip_code':body.address.billing_address.zip_code,
              'phone_no':body.address.billing_address.phone_no,
              'email_id':body.address.billing_address.email_id
            };
          }else{
            shipping_address_id=body.address.shipping_address.address_id;
          }
        }
        //insert data with Billaddress && Shipaddress
        if((shipping_address_id=="" || shipping_address_id<=0) && (billing_address_id=="" || billing_address_id<=0)){
          models.addressModel.forge(billing_address_data).save().then(function (billing_address_model){
            if(billing_address_model){
              billing_address_id=billing_address_model.get('id');
              //console.log("==bill_address_id==>>"+billing_address_id);
              models.addressModel.forge(shipping_address_data).save().then(function (shipping_address_model){
                shipping_address_id=shipping_address_model.get('id');
                //console.log("==ship_address_id==>"+shipping_address_id);
                var order_master_data={
                  'customer_id':body.customer_id,
                  'total_amount':body.total_amount,
                  'sub_total_amount':body.total_amount,
                  'status':'0'
                };
                models.orderMastersModel.forge(order_master_data).save().then(function (order_master_model){
                  if(order_master_model){
                    var order_master_id=order_master_model.get('id');
                    var order_details_data=[];
                    body.order_details.forEach(function(obj,k){
                      var  order_data={
                        'invoice_no':'ORD'+order_master_id+Math.floor(Math.random()*90000)+1+k+order_master_id,
                        'order_master_id':order_master_id,
                        'restaurant_id':obj.restaurant_id,
                        'menu_id':obj.menu_id,
                        'price':obj.price,
                        'qty':obj.qty,
                        'ship_address_id':shipping_address_id,
                        'bill_address_id':billing_address_id,
                        'order_status':'3'
                      };
                      order_details_data.push(order_data);
                    });
                    var order_details_collection_data = orderDetailsCollection.forge(order_details_data);
                    Promise.all(order_details_collection_data.invoke('save')).then(function(order_details_model) {
                      if(order_details_model){
                        var payment_master_data={
                          'total_amount':body.total_amount,
                          'txn_no': new Date().getTime() +order_master_id+'-'+Math.floor(Math.random()*90000)+1000+order_master_id,
                          'customer_id':body.customer_id,
                          'payment_type':'COD',
                          'order_master_id':order_master_id,
                          'status':'1'
                        };
                        models.paymentMastersModel.forge(payment_master_data).save().then(function (payment_master_model){
                          if(payment_master_model){
                            var payment_master_last_id=payment_master_model.get('id');
                            var payment_details_data=[];
                            order_details_model.forEach(function(values){
                              var paymentDetailsData={
                                'payment_master_id':payment_master_last_id,
                                'amount':values.get('price'),
                                'order_details_id':values.get('id'),
                                'status':'2'
                              };
                               payment_details_data.push(paymentDetailsData);
                              });
                              var payment_details_collection_data = paymentDetailsCollection.forge(payment_details_data);
                              Promise.all(payment_details_collection_data.invoke('save')).then(function(payment_details_model) {
                                response = {message: 'order has been placed seccessfully',data:{'order_id':order_master_id},status: 'success',code: '200'};
                                res.json(response);
                              });
                          }else{
                            response = {message: 'Systemerror please try again',status: 'error',code: '8002'};
                            res.json(response);
                          }
                        })
                        .catch(function (error){res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});});
                      }else{
                        response = {message: 'Systemerror please try again',status: 'error',code: '8003'};
                        res.json(response);
                      }   
                    })
                    .catch(function (error){res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});});
                  }else{
                    response = {message: 'Systemerror please try again',status: 'error',code: '8004'}; 
                    res.json(response);
                  }
                })
                .catch(function (error){res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});});
              })
              .catch(function (error){res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});});
            }else{
              response = {message: 'Systemerror please try again',status: 'error',code: '8005'};
              res.json(response);
            }
          })
          .catch(function (error){res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});});
        }
        else if((shipping_address_id=="" || shipping_address_id<=0) && (billing_address_id!="" || billing_address_id>0)){
              models.addressModel.forge(shipping_address_data).save().then(function (shipping_address_model){
                shipping_address_id=shipping_address_model.get('id');
                var order_master_data={
                  'customer_id':body.customer_id,
                  'total_amount':body.total_amount,
                  'sub_total_amount':body.total_amount,
                  'status':'0'
                };
                models.orderMastersModel.forge(order_master_data).save().then(function (order_master_model){
                  if(order_master_model){
                    var order_master_id=order_master_model.get('id');
                    var order_details_data=[];
                    
                    body.order_details.forEach(function(obj,k){
                      var  order_data={
                        'invoice_no':'ORD'+order_master_id+Math.floor(Math.random()*90000)+1+k+order_master_id,
                        'order_master_id':order_master_id,
                        'restaurant_id':obj.restaurant_id,
                        'menu_id':obj.menu_id,
                        'price':obj.price,
                        'qty':obj.qty,
                        'ship_address_id':shipping_address_id,
                        'bill_address_id':billing_address_id,
                        'order_status':'3'
                      };
                      order_details_data.push(order_data);
                    });
                    var order_details_collection_data = orderDetailsCollection.forge(order_details_data);
                    Promise.all(order_details_collection_data.invoke('save')).then(function(order_details_model) {
                      if(order_details_model){
                        var payment_master_data={
                          'total_amount':body.total_amount,
                          'txn_no': new Date().getTime() +order_master_id+'-'+Math.floor(Math.random()*90000)+1000+order_master_id,
                          'customer_id':body.customer_id,
                          'payment_type':'COD',
                          'order_master_id':order_master_id,
                          'status':'1'
                        };
                        models.paymentMastersModel.forge(payment_master_data).save().then(function (payment_master_model){
                          if(payment_master_model){
                            var payment_master_last_id=payment_master_model.get('id');
                            var payment_details_data=[];
                            order_details_model.forEach(function(values){
                              var paymentDetailsData={
                                'payment_master_id':payment_master_last_id,
                                'amount':values.get('price'),
                                'order_details_id':values.get('id'),
                                'status':'2'
                              };
                               payment_details_data.push(paymentDetailsData);
                              });
                              var payment_details_collection_data = paymentDetailsCollection.forge(payment_details_data);
                              Promise.all(payment_details_collection_data.invoke('save')).then(function(payment_details_model) {
                                response = {message: 'order has been placed seccessfully',data:{'order_id':order_master_id},status: 'success',code: '200'};
                                res.json(response);
                              });
                          }else{
                            response = {message: 'Systemerror please try again',status: 'error',code: '8006'};
                            res.json(response);
                          }
                        })
                        .catch(function (error){res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});});
                      }else{
                        response = {message: 'Systemerror please try again',status: 'error',code: '8007'};
                        res.json(response);
                      }   
                    })
                    .catch(function (error){res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});});
                  }else{
                    response = {message: 'Systemerror please try again',status: 'error',code: '8008'}; 
                    res.json(response);
                  }
                })
                .catch(function (error){res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});});
              })
              .catch(function (error){res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});});
        }
        else if((shipping_address_id!="" || shipping_address_id>0) && (billing_address_id=="" || billing_address_id<=0)){
          models.addressModel.forge(billing_address_data).save().then(function (billing_address_model){
            if(billing_address_model){
              billing_address_id=billing_address_model.get('id');
                var order_master_data={
                  'customer_id':body.customer_id,
                  'total_amount':body.total_amount,
                  'sub_total_amount':body.total_amount,
                  'status':'0'
                };
                models.orderMastersModel.forge(order_master_data).save().then(function (order_master_model){
                  if(order_master_model){
                    var order_master_id=order_master_model.get('id');
                    var order_details_data=[];
                    body.order_details.forEach(function(obj,k){
                      var  order_data={
                        'invoice_no':'ORD'+order_master_id+Math.floor(Math.random()*90000)+1+k+order_master_id,
                        'order_master_id':order_master_id,
                        'restaurant_id':obj.restaurant_id,
                        'menu_id':obj.menu_id,
                        'price':obj.price,
                        'qty':obj.qty,
                        'ship_address_id':shipping_address_id,
                        'bill_address_id':billing_address_id,
                        'order_status':'3'
                      };
                      order_details_data.push(order_data);
                    });
                    var order_details_collection_data = orderDetailsCollection.forge(order_details_data);
                    Promise.all(order_details_collection_data.invoke('save')).then(function(order_details_model) {
                      if(order_details_model){
                        var payment_master_data={
                          'total_amount':body.total_amount,
                          'txn_no': new Date().getTime() +order_master_id+'-'+Math.floor(Math.random()*90000)+1000+order_master_id,
                          'customer_id':body.customer_id,
                          'payment_type':'COD',
                          'order_master_id':order_master_id,
                          'status':'1'
                        };
                        models.paymentMastersModel.forge(payment_master_data).save().then(function (payment_master_model){
                          if(payment_master_model){
                            var payment_master_last_id=payment_master_model.get('id');
                            var payment_details_data=[];
                            order_details_model.forEach(function(values){
                              var paymentDetailsData={
                                'payment_master_id':payment_master_last_id,
                                'amount':values.get('price'),
                                'order_details_id':values.get('id'),
                                'status':'2'
                              };
                               payment_details_data.push(paymentDetailsData);
                              });
                              var payment_details_collection_data = paymentDetailsCollection.forge(payment_details_data);
                              Promise.all(payment_details_collection_data.invoke('save')).then(function(payment_details_model) {
                                response = {message: 'order has been placed seccessfully',data:{'order_id':order_master_id},status: 'success',code: '200'};
                                res.json(response);
                              });
                          }else{
                            response = {message: 'Systemerror please try again',status: 'error',code: '8009'};
                            res.json(response);
                          }
                        })
                        .catch(function (error){res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});});
                      }else{
                        response = {message: 'Systemerror please try again',status: 'error',code: '8010'};
                        res.json(response);
                      }   
                    })
                    .catch(function (error){res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});});
                  }else{
                    response = {message: 'Systemerror please try again',status: 'error',code: '8011'}; 
                    res.json(response);
                  }
                })
                .catch(function (error){res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});});
            }else{
              response = {message: 'Systemerror please try again',status: 'error',code: '8012'};
              res.json(response);
            }
          })
          .catch(function (error){res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});});
        }
        else if((shipping_address_id!="" || shipping_address_id>0) && (billing_address_id!="" || billing_address_id>0)){
                var order_master_data={
                  'customer_id':body.customer_id,
                  'total_amount':body.total_amount,
                  'sub_total_amount':body.total_amount,
                  'status':'0'
                };
                models.orderMastersModel.forge(order_master_data).save().then(function (order_master_model){
                  if(order_master_model){
                    var order_master_id=order_master_model.get('id');
                    var order_details_data=[];
                    body.order_details.forEach(function(obj,k){
                      var  order_data={
                        'invoice_no':'ORD'+order_master_id+Math.floor(Math.random()*90000)+1+k+order_master_id,
                        'order_master_id':order_master_id,
                        'restaurant_id':obj.restaurant_id,
                        'menu_id':obj.menu_id,
                        'price':obj.price,
                        'qty':obj.qty,
                        'ship_address_id':shipping_address_id,
                        'bill_address_id':billing_address_id,
                        'order_status':'3'
                      };
                      order_details_data.push(order_data);
                    });
                    var order_details_collection_data = orderDetailsCollection.forge(order_details_data);
                    Promise.all(order_details_collection_data.invoke('save')).then(function(order_details_model) {
                      if(order_details_model){
                        var payment_master_data={
                          'total_amount':body.total_amount,
                          'txn_no': new Date().getTime() +order_master_id+'-'+Math.floor(Math.random()*90000)+1000+order_master_id,
                          'customer_id':body.customer_id,
                          'payment_type':'COD',
                          'order_master_id':order_master_id,
                          'status':'1'
                        };
                        models.paymentMastersModel.forge(payment_master_data).save().then(function (payment_master_model){
                          if(payment_master_model){
                            var payment_master_last_id=payment_master_model.get('id');
                            var payment_details_data=[];
                            order_details_model.forEach(function(values){
                              var paymentDetailsData={
                                'payment_master_id':payment_master_last_id,
                                'amount':values.get('price'),
                                'order_details_id':values.get('id'),
                                'status':'2'
                              };
                               payment_details_data.push(paymentDetailsData);
                              });
                              var payment_details_collection_data = paymentDetailsCollection.forge(payment_details_data);
                              Promise.all(payment_details_collection_data.invoke('save')).then(function(payment_details_model) {
                                response = {message: 'order has been placed seccessfully',data:{'order_id':order_master_id},status: 'success',code: '200'};
                                res.json(response);
                              });
                          }else{
                            response = {message: 'Systemerror please try again',status: 'error',code: '8013'};
                            res.json(response);
                          }
                        })
                        .catch(function (error){res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});});
                      }else{
                        response = {message: 'Systemerror please try again',status: 'error',code: '8014'};
                        res.json(response);
                      }   
                    })
                    .catch(function (error){res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});});
                  }else{
                    response = {message: 'Systemerror please try again',status: 'error',code: '8015'}; 
                    res.json(response);
                  }
                })
                .catch(function (error){res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});});
        }
        else{
          response = {message: 'Address not found',status: 'error',code: '8016'};
          res.json(response);
        }
      }else{
        res.json(response);
      }
    });
  },
  orderList: function(req, res, next) {
    var response = {message:'Invalid request',status: 'success',code: '8017'};
    var customer_id = req.params.customer_id;
    if(customer_id!="" && customer_id>0 && customer_id!=undefined && customer_id!=null){
      models.orderMastersModel.query('orderBy', 'order_date', 'desc').where({'customer_id':customer_id})
      .fetchAll({withRelated: [
        'order_details',
        'payment_master',
        /*'payment_masters.payment_detail',*/
        'order_details.restaurant',
        'order_details.menu',
        'order_details.ship_address',
        'order_details.ship_address.state',
        'order_details.ship_address.city',
        'order_details.bill_address',
        'order_details.bill_address.state',
        'order_details.bill_address.city',
        'order_details.payment_detail'
        ]})
      .then(function (model) { 
        if(model){
          response = {message: 'Order List',status:'success',data:model.toJSON(),code: '8018'};
          res.json(response);
        }else{
          response = {message: 'No Order Found',status: 'success',data:{},code: '8019'};
          res.json(response);
        }
      })
      .catch(function (error){res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});});
    }else{
      res.json(response);
    }
  },
  orderDetail: function(req, res, next) {
    var response = {message:'Invalid request',status: 'success',code: '8021'};
    var customer_id = req.params.customer_id;
    var order_detail_id = req.params.order_detail_id;
    if(customer_id!="" && customer_id>0 && customer_id!=undefined && customer_id!=null){
      models.orderDetailsModel.forge({id:order_detail_id})
      .fetch({withRelated: ['order_master','order_master.payment_master','restaurant','menu','ship_address','ship_address.state','ship_address.city','bill_address','bill_address.state','bill_address.city'
      ,'payment_detail']})
      .then(function (model) { 
        if(model){
          response = {message: 'Order List',status:'success',data:model.toJSON(),code: '8022'};
          res.json(response);
        }else{
          response = {message: 'No Order Found',status: 'success',data:{},code: '8023'};
          res.json(response);
        }
      })
      .catch(function (error){res.status(500).json({msg: error.message, status: 'error', code: 'SYSERR'});});
    }else{
      res.json(response);
    }
  },
 };
