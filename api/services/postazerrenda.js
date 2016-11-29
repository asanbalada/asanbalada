var Promise = require('bluebird');
var ovh = require('ovh')({
  endpoint: process.env.OVH_ENDPOINT || 'ovh-eu',
  appKey: process.env.OVH_APP_KEY || 'demo',
  appSecret: process.env.OVH_APP_SECRET || 'demo',
  consumerKey: process.env.OVH_APP_CONSUMER_KEY || 'demo'
});

function getSubscribers (domain, name) {
  return new Promise(function(resolve, reject) {
    if(process.env.ASANBALADA_DEMO) return resolve([]);
    ovh.request('GET', '/email/domain/' + domain + '/mailingList/' + name + '/subscriber', function (err, subscribers) {
      if(err) return reject(err);
      return resolve(subscribers);
    });
  });
}

function removeSubscriber (domain, name, email) {
  console.log('postazerrenda:remove', name, domain, email);
  return new Promise(function(resolve, reject) {
    ovh.request('DELETE', '/email/domain/' + domain + '/mailingList/' + name + '/subscriber/' + email, function (err, subscribers) {
      if(err) return reject(err);
      return resolve();
    });
  });
}

function addSubscriber (domain, name, email) {
  console.log('postazerrenda:add', name, domain, email);
  return new Promise(function(resolve, reject) {
    ovh.request('POST', '/email/domain/' + domain + '/mailingList/' + name + '/subscriber', { email: email }, function (err, subscribers) {
      if(err) return reject(err);
      return resolve();
    });
  });
}

module.exports = {
  sync: {
    user: function (user, postazerrendak) {
      return new Promise(function(resolve, reject) {
        user.getPostazerrendak().then(function (lists) {
          var oldPostazerrendak = _.map(lists, function (o) {
            return o.dataValues.title + '@' + o.dataValues.domain;
          });
          var newPostazerrendak = _.map(postazerrendak, function(o) {
            return o.email;
          });
          var add = _.difference(newPostazerrendak, oldPostazerrendak);
          var remove = _.difference(oldPostazerrendak, newPostazerrendak);
          var promises = [];

          if(!process.env.ASANBALADA_DEMO) {
            _.each(add, function (o) {
              var d = o.split('@');
              promises.push(addSubscriber(d[1], d[0], user.dataValues.eposta));
            });
            _.each(remove, function (o) {
              var d = o.split('@');
              promises.push(removeSubscriber(d[1], d[0], user.dataValues.eposta));
            });
          }

          promises.push(user.setPostazerrendak(_.map(postazerrendak, 'id')));
          Promise.all(promises).then(function () {
            return resolve();
          });
        });
      });
    },
    list: function (list) {
      return new Promise(function(resolve, reject) {
        var promises = [
          list.getKideak(),
          getSubscribers(list.dataValues.domain, list.dataValues.title)
        ];
        Promise.all(promises).then(function(data){
          var kideak = [];
          if(data[0]) {
            kideak = _.map(data[0], function(o){
              return o.dataValues.eposta;
            });
          }
          var subscribers = data[1] || [];
          var add = _.difference(kideak, subscribers);
          var remove = _.difference(subscribers, kideak);
          var promises = [];
          if(!process.env.ASANBALADA_DEMO) {
            _.each(add, function (o) {
              promises.push(addSubscriber(list.dataValues.domain, list.dataValues.title, o));
            });
            _.each(remove, function (o) {
              promises.push(removeSubscriber(list.dataValues.domain, list.dataValues.title, o));
            });
          }
          Promise.all(promises).then(function () {
            return resolve();
          });
        });
      });
    }
  }
};
