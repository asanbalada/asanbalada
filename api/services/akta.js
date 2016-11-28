var fs = require('fs');
var Promise = require('bluebird');
var moment = require('moment');

module.exports = {
  generate: function (asanblada) {
    return new Promise(function(resolve, reject) {
      var asanbladaJSON = asanblada.toJSON();

      var output = 'data: ' + moment(asanblada.date).format('YYYY-MM-DD') + '\n\n';

      var promises = [
        asanblada.getLantaldeak(),
        asanblada.getPartaideak(),
        asanblada.getProposamenak(),
      ];

      Promise.all(promises).then(function (data) {
        var lantaldeak = data[0];
        var partaideak = data[1];
        var proposamenak = data[2];

        var lantaldeakFormated = _.map(lantaldeak, function (o) {
          return o.dataValues.title;
        });

        var partaideakFormated = _.map(partaideak, function (o) {
          return o.dataValues.izena + ( o.dataValues.abizenak ? ' ' + o.dataValues.abizenak : '' );
        });

        output += 'lantaldeak: ' + lantaldeakFormated.join(', ') + '\n\n';
        output += 'partaideak: ' + partaideakFormated.join(', ') + '\n\n';
        output += 'azalpena:\n\t' + asanbladaJSON.content + '\n\n';



        var proposamenakJSON = _.map(proposamenak, function (o) {
          return o.toJSON();
        });

        var promises = [];
        for (var i = 0; i < proposamenak.length; i++) {
          promises.push(proposamenak[i].getAntolatzaileak());
          promises.push(proposamenak[i].getLagunak());
        }
        Promise.all(promises).then(function (data) {
          for (var i = 0; i < data.length; i+=2) {
            var antolatzaileak = _.map(data[i], function (o) {
              var antolatzailea = o.toJSON();
              return antolatzailea.fullName + ' (' + ( antolatzailea.eposta || '---' ) + ' | ' +  ( antolatzailea.telefonoa || '---') + ')';
            });
            var lagunak = _.map(data[i + 1], function (o) {
              var laguna = o.toJSON();
              return laguna.fullName + ' (' + (laguna.eposta || '---') + ' | ' +  (laguna.telefonoa || '---') + ')';
            });
            proposamenakJSON[i/2].antolatzaileak = antolatzaileak.join(', ');
            proposamenakJSON[i/2].lagunak = lagunak.join(', ');
          }

          var proposamenakFormated = _.map(proposamenakJSON, function (o) {
            return '\t[' + o.type  + '] ' +
                   '(' + o.status  + ') ' +
                   o.title + '\n' +
                   ( o.start ? '\t\thasi: ' + moment(o.start).format('YYYY-MM-DD HH:mm') + '\n' : '' ) +
                   ( o.end ? '\t\tbukatu: ' + moment(o.end).format('YYYY-MM-DD HH:mm') + '\n' : '' ) +
                   ( o.antolatzaileak ? '\t\tantolatzaileak: ' + o.antolatzaileak + '\n' : '' ) +
                   ( o.lagunak ? '\t\tlagunak: ' + o.lagunak + '\n' : '' ) +
                   '\t\tazalpena:\n\t\t\t' + o.content;
          });

          output += 'proposamenak:\n\n' + proposamenakFormated.join('\n\n') + '\n';

          return resolve(output);

        });
      });





    });
  },
  generateFile: function (asanblada) {
    return new Promise(function(resolve, reject) {
      var asanbladaJSON = asanblada.toJSON();
      API.services.akta.generate(asanblada)
      .then(function(akta){
        var fileName = '/tmp/' + asanbladaJSON.id + '-' + Date.now() + '.txt';
        fs.writeFile(fileName, akta, function(err) {
          if(err) {
            return reject(err);
          }

          return resolve(fileName);
        });
      });
    });
  }
};
