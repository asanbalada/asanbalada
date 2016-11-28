module.exports = {
  all: function (req, res) {
    req.model.findAll({
      include: [{
        model: API.models.eragilea,
        as: 'kideak'
      }, {
        model: API.models.postazerrenda
      }]
    }).then(function (data) {
      res.json(data);
    });
  },
  one: function (req, res) {
    req.model.findById(req.params.id, {
      include: [{
        model: API.models.eragilea,
        as: 'kideak'
      }, {
        model: API.models.postazerrenda
      }]
    }).then(function (data) {
      res.json(data);
    });
  },
  create: function(req, res) {
    req.model
    .create(req.body)
    .then(function(item){
      item.setKideak(_.map(req.body.kideak, 'id'));
      item.setPostazerrenda(req.body.postazerrenda);
      return res.json(item);
    });
  },

  update: function(req, res) {
    req.model
    .update(req.body, {where:{id:req.body.id}})
    .then(function(item){
      req.model
      .findById(req.body.id)
      .then(function(item){
        item.setKideak(_.map(req.body.kideak, 'id'));
        item.setPostazerrenda(null).then(function () {
          item.setPostazerrenda(req.body.postazerrenda);
        });

        return res.json(item);
      });
    });
  },
};
