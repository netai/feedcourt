var Checkit = require('checkit');
var db = require('../config/db');

var imagesModel = db.Model.extend({
  constructor: function() {
    db.Model.apply(this, arguments); // super()
    this.on('saving', this.validate.bind(this));
  },
  validations: {img_name: ['required'], type: ['required'],reference_id: ['required'], added_by: ['required']},
  validate: function() {return new Checkit(this.validations).run(this.attributes);},
  tableName: 'images',
});

module.exports = imagesModel;
