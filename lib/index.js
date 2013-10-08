"use strict";
var config, files, fs, logger, plato, registration, wrench, _assembleFiles, _runPlato;

fs = require('fs');

plato = require('plato');

wrench = require('wrench');

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
  /*
  if (options.jshint && !options.jshint.options) {
    options.jshint = {
      options : options.jshint,
      globals : options.jshint.globals || {}
    };
    delete options.jshint.options.globals;
  }
  */

  if (files.length > 0) {
    console.log("Running plato on " + (JSON.stringify(files, 0, null)));
    return plato.inspect(files, mimosaConfig.plato.destDirFull, mimosaConfig.plato.options, next);
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
