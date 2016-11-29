var Promise = require('bluebird');
var moment = require('moment');
var nodemailer = require('nodemailer');

var email = process.env.ASANBALADA_EMAIL ? process.env.ASANBALADA_EMAIL.split('@') : ['example', 'example.com'];
var pass = process.env.ASANBALADA_EMAIL_PASSWORD || 'password';
var server = process.env.ASANBALADA_EMAIL_SMTP_SERVER || 'example.com';

var transporter = nodemailer.createTransport('smtps://' + email[0] + '%40' + email[1] + ':' + pass  + '@' + server);

var TEMPLATE_TAG_REGEXP = /{{[^}]+}}/g;

module.exports.proposamena = function proposamena(args) {
  return new Promise(function(resolve, reject) {
    var promises = [
      API.models.proposamena.findById(args.proposamena, {
        include: [
          {
            model: API.models.asanblada
          },
          {
            model: API.models.baliabidea,
            as: 'baliabideak'
          },
          {
            model: API.models.eragilea,
            as: 'antolatzaileak'
          },
          {
            model: API.models.eragilea,
            as: 'lagunak'
          },
          {
            model: API.models.lantaldea,
            as: 'lantaldeak'
          }
        ]
      }),
      API.models.eposta.findById(args.eposta),
      API.models.eragilea.findAll({
        where: {
          id: {
            $in: args.dest
          }
        },
        attributes: ['eposta']
      })
    ];

    Promise.all(promises).then(function(data){
      var proposamena = data[0].toJSON();
      var eposta = data[1].toJSON();
      var dest = _.map(data[2], function (o) {
        return o.toJSON().eposta;
      });

      var email = formatProposamena(proposamena, eposta, args.oharrak);
      email.to = dest;

      sendEmail(email).then(function(info) {
        return resolve(info);
      });
    }, function (e) {
      return reject(e);
    });
  });
};

function sendEmail(email) {
  return new Promise(function(resolve, reject) {
    if(process.env.ASANBALADA_DEMO) return resolve([]);

    var mailOptions = {
      from: '"' + (process.env.ASANBALADA_EMAIL_SENDER_NAME || 'Asanbalada') + '" <' + (process.env.ASANBALADA_EMAIL || 'example@example.com') + '>', // sender address
      to: email.to.join(', '),
      subject: email.subject,
      text: email.body
      // html: email.body
    };

    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        console.log(error);
        return resolve(error);
      }
      console.log(info);
      return resolve(info);
    });
  });
}

function formatProposamena(proposamena, eposta, oharrak) {
  var output = proposamena.title;

  var info = {
    uuid: proposamena.uuid,
    title: (proposamena.title || '---'),
    content: (proposamena.content || ''),
    notes: oharrak,
    start: proposamena.start ? moment(proposamena.start).format('YYYY-MM-DD HH:mm'): '',
    end: proposamena.end ? moment(proposamena.end).format('YYYY-MM-DD HH:mm'):  '',
    type: proposamena.type,
    status: proposamena.status,
    asanblada: formatAsanblada(proposamena.asanblada),
    antolatzaileak: _.map(proposamena.antolatzaileak, formatEragilea),
    lagunak: _.map(proposamena.lagunak, formatEragilea),
    lantaldeak: _.map(proposamena.lantaldeak, formatLantaldea),
    baliabideak: _.map(proposamena.baliabideak, formatBaliabidea)
  };

  var queryMatchesSubject = eposta.subject.match(TEMPLATE_TAG_REGEXP);
  var queryMatchesBody = eposta.body.match(TEMPLATE_TAG_REGEXP);

  var subject = eposta.subject;
  var body = eposta.body;

  _.each(queryMatchesSubject, function (qm) {
    var attr = _.toLower(_.trim(qm.replace('{{', '').replace('}}', '')));
    subject = replaceAll(subject, qm, _.truncate(info[attr], { length: 50 }));
  });

  _.each(queryMatchesBody, function (qm) {
    var attr = _.toLower(_.trim(qm.replace('{{', '').replace('}}', '')));
    body = replaceAll(body, qm, info[attr]);
  });

  return {
    subject: subject,
    body: body
  };
}

function formatAsanblada(asanblada) {
  return moment(asanblada.date).format('YYYY-MM-DD');
}

function formatEragilea(eragilea) {
  var formated = _.toUpper(eragilea.fullName) + '\n' +
                 ( eragilea.telefonoa ? eragilea.telefonoa + '\n' : '') +
                 ( eragilea.eposta ? eragilea.eposta + '\n' : '');

  return formated;
}

function formatLantaldea(lantaldea) {
  var formated = _.toUpper(lantaldea.title) + '\n' +
                 ( eragilea.email ? eragilea.email + '\n' : '');

  return formated;
}

function formatBaliabidea(baliabidea) {
  var formated = _.toUpper(baliabidea.title) + '\n' +
                 ( baliabidea.description ? baliabidea.description + '\n' : '' ) +
                 ( baliabidea.usage ? baliabidea.usage + '\n' : '' );
  return formated;
}

// http://stackoverflow.com/a/1144788
function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

// http://stackoverflow.com/a/1144788
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
