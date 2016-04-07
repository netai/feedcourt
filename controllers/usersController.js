var usersModel = require('../models/usersModel');

module.exports = {
  // GET /users/:id
  getUser: function(req, res, next) {
    var id = req.params.id;
    usersModel.forge({id: id})
    .fetch()
    .then(function (model) {
      res.json(usersModel.toJSON());
    })
    .otherwise(function (error) {
      res.status(500).json({msg: error.message});
    });
  },
  // GET /users
  getUsers: function(req, res, next) {
    usersModel.forge()
    .fetchAll()
    .then(function (model) {
      res.json(model.toJSON());
    })
    .otherwise(function (error) {
      res.status(500).json({msg: error.message});
    });
  },
  // POST /users
  saveUser: function(req, res, next) {
    usersModel.forge(req.body)
    .save()
    .then(function (model) {
      res.json(model.toJSON());
    })
    .otherwise(function (error) {
      res.status(500).json({msg: error.message});
    });
  }
};
