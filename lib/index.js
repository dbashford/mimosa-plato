"use strict";
var config, files, fs, logger, path, plato, registration, _assembleFiles, _runPlato;

fs = require('fs');

path = require('path');

plato = require('plato');

logger = require('logmimosa');

config = require('./config');

files = [];

registration = function(mimosaConfig, register) {
  var e;
  if (mimosaConfig.isBuild) {
    e = mimosaConfig.extensions;
    register(['buildFile'], 'afterWrite', _assembleFiles, e.javascript);
    return register(['postBuild'], 'init', _runPlato);
  }
};

_assembleFiles = function(mimosaConfig, options, next) {
  options.files.forEach(function(file) {
    if (!(mimosaConfig.plato.excludeVendor && file.inputFileName.indexOf(mimosaConfig.vendor.javascripts) === 0)) {
      return files.push(file.outputFileName);
    }
  });
  return next();
};

_runPlato = function(mimosaConfig, options, next) {
  if (files.length > 0) {
    if (logger.isDebug) {
      logger.debug("Running plato on " + (JSON.stringify(files, 0, null)));
    }
    return plato.inspect(files, mimosaConfig.plato.destDirFull, mimosaConfig.plato.options, function() {
      var outPath;
      outPath = path.join(mimosaConfig.plato.destDirFull, "index.html");
      logger.info("A Plato JavaScript Source Analysis report is available at [[ " + outPath + " ]]");
      return next();
    });
  } else {
    return next();
  }
};

module.exports = {
  registration: registration,
  defaults: config.defaults,
  placeholder: config.placeholder,
  validate: config.validate
};
