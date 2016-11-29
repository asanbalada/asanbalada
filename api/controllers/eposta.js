module.exports = {
  'post /:id/send': function (req, res) {
    API.services.eposta.proposamena({
      proposamena: req.body.proposamena,
      eposta: req.params.id,
      dest: req.body.dest,
      oharrak: req.body.oharrak
    }).then(function(){
      API.models.proposamena.update(
        { sended: true },
        {
          where: {
            id: req.body.proposamena
          }
        }
      );
      return res.sendStatus(200);
    });

  }
};
