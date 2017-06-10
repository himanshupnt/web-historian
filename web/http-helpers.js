var path = require('path');
var url = require('url');
var fs = require('fs');

var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.assetGen = function (req) {
  var asset;

  var parsedUrl = url.parse(req.url);
  var pathName = parsedUrl.pathname;

  if (pathName === '/') {
    asset = fs.readFileSync(archive.paths.siteAssets + '/index.html');
  } else {
    asset = fs.readFileSync(archive.paths.archivedSites + pathName);
  }

  return asset;
};

exports.sendResponse = function (response,asset,statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, exports.headers);
  response.end(asset)
};

var options = {
  'GET' : function () {

  }
}


exports.serveAssets = function(res, asset, callback, statusCode) {
  callback(res,asset,statusCode);
};

