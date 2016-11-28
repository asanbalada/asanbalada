module.exports = {
  all: function(req, res) {
    req.model.findAll().then(function(items){
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
      }]
    })
    .then(function(item){
      return res.json(item);
    });
  },
};
