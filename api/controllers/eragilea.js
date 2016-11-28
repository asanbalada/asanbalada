module.exports = {
  all: function (req, res) {
    req.model.findAll().then(function (data) {
      res.json(data);
    });
  },
  one: function(req, res) {
    req.model
    .findById(req.params.id, {
      include: [{
          model: req.model,
          as: 'kolektiboak'
      }, {
          model: API.models.lantaldea,
          as: 'lantaldeak'
      }, {
          model: API.models.postazerrenda,
          as: 'postazerrendak'
      }, {
          model: API.models.baliabidea,
          as: 'baliabideak'
      }]
    })
    .then(function(item){
      return res.json(item);
    });
  },
  create: function(req, res) {
    req.model
    .create(req.body)
    .then(function(item){
      item.setKolektiboak(_.map(req.body.kolektiboak, 'id'));
      API.services.postazerrenda.sync.user(item, req.body.postazerrendak);
      item.setLantaldeak(_.map(req.body.lantaldeak, 'id'));
      item.setBaliabideak(_.map(req.body.baliabideak, 'id'));

      return res.json(item);
    });
  },
  update: function(req, res) {
    req.model
    .update(req.body, {where:{id:req.body.id}})
    .then(function(){
      req.model
      .findById(req.body.id)
      .then(function(item){
        item.setKolektiboak(_.map(req.body.kolektiboak, 'id'));
        API.services.postazerrenda.sync.user(item, req.body.postazerrendak);
        item.setLantaldeak(_.map(req.body.lantaldeak, 'id'));
        item.setBaliabideak(_.map(req.body.baliabideak, 'id'));

        return res.json(item);
      });
    });
  },
};
