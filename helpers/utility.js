var gm = require('gm').subClass({ imageMagick: true }),
    path = require('path'),
    fs = require('fs-extra');

module.exports = {
  getFileName: function(name){
    var file_name_arr = name.split('.');
    var file_name = (new Date().getTime())+'.'+file_name_arr[file_name_arr.length-1];
    return file_name;
  },
  saveImageAndThumb: function(file,file_name,next){
    var dest_path = path.join(__dirname,'..','public','media','images',file_name);
    var thumb_path = path.join(__dirname,'..','public','media','images','thumb',file_name);
    fs.copy(file.destination+'/'+file.filename, dest_path, function (err) {
      if (err){
        console.log(err);
      } else{
        fs.copy(file.destination+'/'+file.filename, thumb_path, function (err) {
          if (err){
            console.log(err);
          }
        });
        fs.remove(file.destination, function (err) {
          if (err) {console.log(err)}
          next();
        });
      }
    });
  }
};
