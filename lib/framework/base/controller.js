module.exports = {
  all: function(req, res) {
    req.model.findAll().then(function(items){
      return res.json(items);
    });
  },
  one: function(req, res) {
    req.model
    .findById(req.params.id)
    .then(function(item){
      return res.json(item);
    });
  },
  create: function(req, res) {
    req.model
    .create(req.body)
    .then(function(item){
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

        return res.json(item);
      });
    });
  },
  destroy: function(req, res) {
    req.model
    .destroy({ where: { id: req.params.id } })
    .then(function(item){
      return res.json(item);
    });
  },
};
