var _ = require('lodash');
var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: process.env.UPLOADS_DIR || 'uploads/' });

function generator(){
  _.each(API.controllers, function(controller, key){
    router.use( '/' + key,
      generateRoutes(API.models[key], controller)
    );
  });

  return router;
}

function generateRoutes(model, controller){
  // new Router for this model-controller
  var router = express.Router();

  if(model){
    // "extend" from base CRUD controller
    _.defaults(controller, require(__dirname + '/../base/controller'));
    // Inject model in request
    router.all('*',function(req, res, next){
      req.model = model;
      next();
    });
  }

  // generate CRUD, upload and custom routes
  _.each(controller, function(fn, key){
    var method, route;
    switch (key) {
      case 'all':
        method = 'get';
        route = '/';
        break;
      case 'one':
        method = 'get';
        route = '/:id';
        break;
      case 'create':
        method = 'post';
        route = '/';
        break;
      case 'update':
        method = 'put';
        route = '/:id';
        break;
      case 'destroy':
        method = 'delete';
        route = '/:id';
        break;
      default:
        // parse custom route
        var map = key.split(' ');
        method = map[0];
        route = map[1];
        break;
    }

    if(method === 'upload') {
      router.post(route, upload.single('file'), fn);
    } else {
      router[method](route, fn);
    }
  });

  return router;
}

module.exports = generator;
