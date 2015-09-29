var path = require('path');
var dir = require('node-dir');
var YAML = require('yamljs');
var _ = require('lodash');

module.exports.LinkMapper = function (componentsBasePath) {
  if (!componentsBasePath) {
    throw 'LinkMapper requires a base path';
  }

  return {
    load: function(file) {
      return YAML.load(file);
    },
    mapComponentPath: function(item, filename) {
      if (!item.match(/.html/)) {
        if (item.match(/^:/)) {
          item = item.replace(/^:/, filename + '-');
        }

        if (!item.match(/-/) && !item.match(/^.\//)) {
          item = [filename, item].join('-');
        }
        if (!item.match(/\//)) {
          item = path.join(item, item);
        }
        item += '.html';
      }
      return item;
    },
    createLink: function(item, filename) {
      if (_.isEmpty(item)) {
        return;
      }
      var componentPath = this.mapComponentPath(item, filename);
      var fullPath = path.join(componentsBasePath, componentPath);
      return '<link rel="import" href="' + fullPath + '"/>';
    },
    createLinks: function(file) {
      var items = this.load(file);
      var filename = path.basename(file, '.yml');
      if (items && items.length > 0) {
        return items.map((item) => {
          return this.createLink(item, filename);
        }).join('\n');
      } else {
        return '\n';
      }
    }
  };
};


module.exports.LinksGenerator = function (linkMapper) {
  return {
    forFiles: function(ymlDir, cb) {
      dir.files(ymlDir, (err, files) => {
          if (err) {
            throw err;
          }
          var links = files.map((file) => {
            var header = '<!-- ' + path.basename(file, '.yml') + '-->';
            var links = linkMapper.createLinks(file);
            return [header, links].join('\n');
          }).join('\n');
          cb(links);
      });
    },
    forFile: function(ymlFile, cb) {
      var links = linkMapper.createLinks(ymlFile);
      cb(links);
    }
  };
};
