var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var fs = require('fs');

var httpHelper = require('./http-helpers');

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    var asset = httpHelper.assetGen(req);
    httpHelper.serveAssets(req, res, asset, httpHelper.sendResponseOnGet);
  } else if (req.method === 'POST') {
    httpHelper.sendResponseOnPost(req, res);
  }
};