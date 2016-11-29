var Promise = require('bluebird')

module.exports = {
  all: function(req, res) {
    req.model.findAll({
      include: [
        {
          model: API.models.eragilea,
          as: 'antolatzaileak',
          attributes: ['izena']
        },
        {
          model: API.models.eragilea,
          as: 'lagunak',
          attributes: ['izena']
        },
        {
          model: API.models.asanblada,
          attributes: ['date']
        }
      ]
    }).then(function(items){
      return res.json(items);
    });
  },
  one: function(req, res) {
    req.model
    .findById(req.params.id, {
      include: [{
        model: API.models.eragilea,
        as: 'lagunak'
      }, {
        model: API.models.eragilea,
        as: 'antolatzaileak'
      }, {
        model: API.models.proposamena,
        as: 'refs'
      }, {
        model: API.models.baliabidea,
        as: 'baliabideak'
      }, {
        model: API.models.lantaldea,
        as: 'lantaldeak'
      }]
    })
    .then(function(item){
      return res.json(item);
    });
  },
  update: function(req, res) {
    upsertProposamena(req.body)
    .then(function(proposamena){
        return res.json(proposamena);
    });
  },
};


function upsertProposamena (data) {
  return new Promise(function(resolve, reject) {
    if (data.id) {
      return API.models.proposamena.update(data, {where:{id:data.id}}).then(function(updatedRow){
        API.models.proposamena.findById(data.id).then(function(proposamena) {
          return Promise.all(
            [proposamena.setLagunak(_.map(data.lagunak, 'id')),
            proposamena.setAntolatzaileak(_.map(data.antolatzaileak, 'id')),
            proposamena.setLantaldeak(_.map(data.lantaldeak, 'id')),
            proposamena.setRefs(_.map(data.refs, 'id')),
            proposamena.setBaliabideak(_.map(data.baliabideak, 'id'))]
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
          proposamena.setLantaldeak(_.map(data.lantaldeak, 'id')),
          proposamena.setRefs(_.map(data.refs, 'id')),
          proposamena.setBaliabideak(_.map(data.baliabideak, 'id'))]
        ).then(function(){
          return resolve(proposamena);
        });
      });
    }
  });
}
