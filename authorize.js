var ovh = require('ovh')({
  endpoint: process.env.ASANBALADA_OVH_ENDPOINT || 'ovh-eu',
  appKey: process.env.ASANBALADA_OVH_APP_KEY,
  appSecret: process.env.ASANBALADA_OVH_APP_SECRET
});

ovh.request('POST', '/auth/credential', {
  'accessRules': [
    { 'method': 'GET', 'path': '/email/domain/*'},
    { 'method': 'POST', 'path': '/email/domain/*'},
    { 'method': 'PUT', 'path': '/email/domain/*'},
    { 'method': 'DELETE', 'path': '/email/domain/*'}
  ]
}, function (error, credential) {
  console.log(error || credential);
});
