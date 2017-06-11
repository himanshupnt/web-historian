var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var fetchHtml = require('../workers/htmlfetcher');
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    var sites = data.split('\n');
    callback(sites);
  });
};

exports.isUrlInList = function(url, callback) {
  return exports.readListOfUrls(function(data) {
    if ( data.indexOf(url) > -1 ) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', function(err) {
    if(err) {
      console.log('Error in appending: ', err);
      // throw new Error(err);
    }
    callback();
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, function(err, files) {
    if ( files.indexOf(url) > -1 ) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

exports.downloadUrls = function(urls) {
  urls.forEach(function(url) {
  fetchHtml.fetch(url, function (body) {
    var html = body;
    var path = exports.paths.archivedSites + '/' + url;
    fs.writeFile(path, html, 'utf8', function(err) {
      if (err) {
        throw new Error(err);
      } else {
        console.log('The file has been saved!');
      }
    });
  });
  });
};
