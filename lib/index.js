'use strict';

var path        = require('path');
var _           = require('lodash');
var through     = require('through2');
var gutil       = require('gulp-util');
var PluginError = gutil.PluginError;
var utils       = require('./utils');

var defaultConfig =  {
  external: {
    componentBaseDir: '../bower_components/',
    targetFile: 'import-elements'
  },
  app: {
    componentBaseDir: './',
    targetFile: 'app-elements'
  }
};

function gulpLinkImports(opts){
    // combine with default options
    opts = opts || {};

    // allow external: true or app: true to use default configs
    if (opts.external) {
      opts = _.extend(opts, defaultConfig.external);
    }
    if (opts.app) {
      opts = _.extend(opts, defaultConfig.app);
    }

    var allLinks = [];

    function bufferContents(file, enc, callback) {
      // Pass file through if:
      // - file has no contents
      // - file is a directory
      if (file.isNull() || file.isDirectory()) {
          this.push(file);
          return callback();
      }
      // User's should be using a compatible glob with plugin.
      // Example: gulp.src('images/**/*.{jpg,png}').pipe(watermark())
      if (['.yml', '.yaml'].indexOf(path.extname(file.path)) === -1) {
          this.emit('error', new PluginError({
              plugin: 'LinkImports',
              message: 'Supported formats include YML and YAML only.'
          }));
          return callback();
      }

      // No support for streams
      if (file.isStream()) {
          this.emit('error', new PluginError({
              plugin: 'LinkImports',
              message: 'Streams are not supported.'
          }));
          return callback();
      }

      if (file.isBuffer()) {
          var header = '<!-- ' + path.basename(file.path, '.yml') + ' -->';
          allLinks.push(header);
          var linkMapper = new utils.LinkMapper(opts.componentBaseDir);
          var importsLinksGen = new utils.LinksGenerator(linkMapper);
          importsLinksGen.forFile(file.path, function(links) {
            allLinks.push(links);
          });
      }
      callback();
    }

    function endStream() {
      var content = allLinks.join('\n');
      this.emit('data', content);
      this.emit('end');
    }

    return through({objectMode: true}, bufferContents, endStream);
}

module.exports = gulpLinkImports;