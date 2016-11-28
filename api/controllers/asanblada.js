var Promise = require('bluebird');
var moment = require('moment');

module.exports = {
  all: function (req, res) {
    req.model.findAll({
      include: [{
        model: API.models.lantaldea,
        as: 'lantaldeak'
      }]
    }).then(function (data) {
      res.json(data);
    });
  },
  one: function (req, res) {
    req.model.findById(req.params.id, {
      include: [{
          model: API.models.proposamena,
          as: 'proposamenak',
          include: [{
            model: API.models.eragilea,
            as: 'antolatzaileak'
          }, {
            model: API.models.eragilea,
            as: 'lagunak'
          }, {
            model: API.models.proposamena,
            as: 'refs'
          }, {
            model: API.models.baliabidea,
            as: 'baliabideak'
          }]
      }, {
        model: API.models.eragilea,
        as: 'partaideak'
      }, {
        model: API.models.lantaldea,
        as: 'lantaldeak'
      }]
    }).then(function (data) {
      res.json(data);
    });
  },
  create: function(req, res) {
    req.model
    .create(req.body)
    .then(function(asanblada){

      var promises = [];
      for (var i = 0; i < req.body.proposamenak.length; i++) {
        promises.push(upsertProposamena(req.body.proposamenak[i], asanblada));
      }
      promises.push(asanblada.setPartaideak(_.map(req.body.partaideak, 'id')));
      promises.push(asanblada.setLantaldeak(_.map(req.body.lantaldeak, 'id')));

      Promise.all(promises).then(function(proposamenak){

        req.model.findById(asanblada.id, {
          include: [{
            model: API.models.proposamena,
            as: 'proposamenak',
            include: [{
              model: API.models.eragilea,
              as: 'antolatzaileak'
            }, {
              model: API.models.eragilea,
              as: 'lagunak'
            }, {
              model: API.models.proposamena,
              as: 'refs'
            }]
          }, {
            model: API.models.eragilea,
            as: 'partaideak'
          }, {
            model: API.models.lantaldea,
            as: 'lantaldeak'
          }]
        })
        .then(function(populated){
          return res.json(populated);
        });
      });

    });
  },
  update: function(req, res) {
    req.model
    .update(req.body, {where:{id:req.body.id}})
    .then(function(){
      req.model
      .findById(req.body.id)
      .then(function(asanblada){
        var promises = [];
        for (var i = 0; i < req.body.proposamenak.length; i++) {
          promises.push(upsertProposamena(req.body.proposamenak[i], asanblada));
        }
        promises.push(asanblada.setPartaideak(_.map(req.body.partaideak, 'id')));
        promises.push(asanblada.setLantaldeak(_.map(req.body.lantaldeak, 'id')));

        Promise.all(promises).then(function(proposamenak){

          req.model.findById(asanblada.id, {
            include: [{
              model: API.models.proposamena,
              as: 'proposamenak',
              include: [{
                model: API.models.eragilea,
                as: 'antolatzaileak'
              }, {
                model: API.models.eragilea,
                as: 'lagunak'
              }, {
                model: API.models.proposamena,
                as: 'refs'
              }]
            }, {
              model: API.models.eragilea,
              as: 'partaideak'
            }, {
              model: API.models.lantaldea,
              as: 'lantaldeak'
            }]
          })
          .then(function(populated){
            return res.json(populated);
          });
        });
      });
    });
  },
  'get /:id/export': function (req, res) {
    req.model.findById(req.params.id, {
      include: [{
        model: API.models.lantaldea,
        as: 'lantaldeak'
      }]
    }).then(function(asanblada){
      var asanbladaJSON = asanblada.toJSON();
      var lantaldeak = _.map(asanbladaJSON.lantaldeak, 'title');
      if (lantaldeak.length) lantaldeak.unshift('');
      lantaldeak = lantaldeak.join('-');
      API.services.akta.generateFile(asanblada)
      .then(function(akta){
        return res.download(akta, 'akta-' + moment(asanbladaJSON.date).format('YYYY-MM-DD') + lantaldeak);
      });
    });
  }
};

function upsertProposamena (data, asanblada) {
  return new Promise(function(resolve, reject) {
    if (data.id) {
      return API.models.proposamena.update(data, {where:{id:data.id}}).then(function(updatedRow){
        API.models.proposamena.findById(data.id).then(function(proposamena) {
          return Promise.all(
            [proposamena.setLagunak(_.map(data.lagunak, 'id')),
            proposamena.setAntolatzaileak(_.map(data.antolatzaileak, 'id')),
            proposamena.setRefs(_.map(data.refs, 'id')),
            proposamena.setBaliabideak(_.map(data.baliabideak, 'id')),
            proposamena.setAsanblada(asanblada)]
          ).then(function(){
            return resolve(proposamena);
          });
        });
      });
    } else {
      return API.models.proposamena.create(data).then(function(proposamena){
        return Promise.all(
          [proposamena.setLagunak(_.map(data.lagunak, 'id')),
          proposamena.setAntolatzaileak(_.map(data.antolatzaileak, 'id')),
          proposamena.setRefs(_.map(data.refs, 'id')),
          proposamena.setBaliabideak(_.map(data.baliabideak, 'id')),
          proposamena.setAsanblada(asanblada)]
        ).then(function(){
          return resolve(proposamena);
        });
      });
    }
  });
}
