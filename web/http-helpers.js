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

var mimeType = {
  '.css': 'text/css',
  '.html': 'text/html'
};

var urlParser = function (req) {
  var parsed = {};
  parsed.parsedUrl = url.parse(req.url);
  parsed.pathName = parsed.parsedUrl.pathname;
  parsed.ext = path.parse(parsed.pathName).ext;
  return parsed;
};

exports.assetGen = function (req) {
  var asset;
  var pathName = urlParser(req).pathName;

  if (pathName === '/') {
    asset = fs.readFileSync(archive.paths.siteAssets + '/index.html');
  } else if (pathName === '/styles.css') {
    asset = fs.readFileSync(archive.paths.siteAssets + pathName);
  } else {
    try {
      asset = fs.readFileSync(archive.paths.archivedSites + pathName);
    } catch (err) {
      if (err.code === 'ENOENT') {
        asset = null;
        console.log(`${pathName} not found`);
      }
    }
  }

  return asset;
};

exports.sendResponseOnGet = function (req, response, asset, statusCode) {
  var ext = urlParser(req).ext;

  if (asset === null) {
    statusCode = 404;
  } else {
    statusCode = statusCode || 200;
  }

  exports.headers['Content-Type'] = mimeType[ext];
  response.writeHead(statusCode, exports.headers);
  asset === null ? response.end('404 not found') : response.end(asset);
};



exports.sendResponseOnPost = function (req, response, callback) {
  // var ext = urlParser(req).ext;
  var postAsset; //= fs.readFileSync(archive.paths.siteAssets + '/loading.html');
  var reqPath = req;
  var reqUrl;
  // var ext = urlParser(req).ext;
  var body = '';

  req.on('data', function(chunk) {
    body += chunk;
    reqUrl = body.split('url=')[1];
  });

  req.on('end', function () {
    exports.headers['Content-Type'] = mimeType['.html'];
    response.writeHead(302, exports.headers);

    archive.isUrlArchived (reqUrl, function(isTrue) {
      if (isTrue) {
        postAsset = fs.readFileSync(archive.paths.archivedSites + '/' + reqUrl);

        // archive.addUrlToList(reqUrl, function() {
        //   archive.downloadUrls([reqUrl]);
        // });
        response.end(postAsset);
      } else {
        postAsset = fs.readFileSync(archive.paths.siteAssets + '/loading.html');
        archive.addUrlToList(reqUrl, function() {
          archive.downloadUrls([reqUrl]);
        });
        response.end(postAsset);
      }
    })

    // archive.readListOfUrls(function(data) {

    //   // console.log(data);
    // });

    // fs.appendFile(archive.paths.list, reqUrl + '\n', function(err) {
    //   if(err) {
    //     console.log('Error in appending: ', err);
    //   }
    // });

  });
};



exports.serveAssets = function(req, res, asset, callback, statusCode) {
  callback(req,res,asset,statusCode);
};

