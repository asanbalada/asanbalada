var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var cors = require('cors');

var app = express();

app.use('/api',bodyParser.urlencoded({ extended: false }));
app.use('/api', bodyParser.json());
app.use('/', express.static('public'));
app.use(cors());
var MikroFram = require(__dirname + '/lib/framework');

global._ = _;
global.API = API = {
  controllers: requireDir(__dirname + '/api/controllers'),
  services: requireDir(__dirname + '/api/services')
};

new MikroFram.db({
  dbPath:  process.env.ASANBALADA_DB_PATH || __dirname + '/db.sqlite',
  modelsPath: __dirname + '/api/models'
}, function(err, models){
  if(err) {
    console.log(err);
  } else {
    API.models = models;
    app.use('/api', MikroFram.generators.routes());
    app.listen(process.env.ASANBALADA_PORT || 3000, 'localhost', function () {
      console.log('Listening on port ' + (process.env.ASANBALADA_PORT || 3000));
    });
  }
});

function requireDir(dir) {
  var files = fs.readdirSync(dir);
  if(!files) return console.error("error reading " + dir);
  var obj = {};
  _.each(files, function(file){
    obj[file.replace('.js','')] = require(path.resolve(dir + "/"+ file));
  });

  return obj;
}
