// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var request = require('request');

var archive = require('../helpers/archive-helpers');

exports.fetch = function (url) {
  console.log('THIS IS URL', url);
  var formatUrl = 'http://' + url;
  request(formatUrl, function (err, response, body) {
    return body;
  })
}
