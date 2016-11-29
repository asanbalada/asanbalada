var Sequelize = require('sequelize');
var fs = require('fs');
var path = require('path');


function DB(args, cb){
  var self = this;
  var MODELS_DIR = args.modelsPath;
  var sequelize = new Sequelize(
    args.dbPath || 'db.sqlite',
    args.dbUser || '',
    args.dbPassword || '',
  {
    dialect: 'sqlite',
    storage: args.dbPath,
    logging: false
  });

  // Load models
  fs.readdir(MODELS_DIR, function(err, list) {
    if(err) {
      console.error("Cannot read models folder");
    } else {
      var associations = null;
      for (var i = 0; i < list.length; i++) {
        var file = list[i];
        if (file === '_associations.js') {
          associations = require(path.join(MODELS_DIR, file));
        } else {
          self[file.replace('.js','')] = sequelize.import(path.join(MODELS_DIR, file));
        }
      }

      if(associations) {
        for (var parent in associations) {
          for (var child in associations[parent]) {
            var options = {};
            var type = associations[parent][child];
            if (_.isObject(type)) {
              type = Object.keys(type)[0];
              var o = associations[parent][child][type];
              if(!_.isArray(o)) o = [o];
              for (var i = 0; i < o.length; i++) {
                if (type === 'belongsToMany' && _.isString(o[i])) {
                  options = {
                    through: self[o[i]] || o[i]
                  };
                } else {
                  options = o[i];
                }
                self[parent][type](self[child], options);
              }
            }
          }
        }
      }
    }
  });


  sequelize.sync().then(function() {
    console.log("DB sync'ed. Let's go!");
    cb(null, self);
  }).catch(function(error) {
    console.log("ERROR", error);
    cb(error, null);
  });
}

module.exports = DB;
