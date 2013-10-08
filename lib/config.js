"use strict";
var path;

path = require('path');

exports.defaults = function() {
  return {
    plato: {
      destDir: ".mimosa/plato",
      excludeVendor: true,
      options: {
        exclude: [/\.min\.js$/],
        complexity: {
          newmi: true,
          trycatch: true,
          forin: true
        }
      }
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n  # plato:                        # Config for mimosa-plato module\n    # destDir: \".mimosa/plato\"    # Location to write plato static analysis report\n    # excludeVendor: true         # Whether or not to exclude files in the vendor.javascripts dir\n    # options:\n      # exclude: [/\\.min\\.js$/] # an array of regexes to match files to exclude from processing\n      # complexity:               # Complexity rule configuration, see:\n                                  # https://github.com/philbooth/complexityReport.js#calling-the-library\n        # newmi: true             # Default complexity rule\n        # trycatch: true          # Default complexity rule\n        # forin: true             # Default complexity rule\n";
};

exports.validate = function(config, validators) {
  var errors, excl, regexes, _i, _len, _ref;
  errors = [];
  if (validators.ifExistsIsObject(errors, "plato config", config.plato)) {
    validators.ifExistsIsBoolean(errors, "plato.excludeVendor", config.plato.excludeVendor);
    if (validators.ifExistsIsString(errors, "plato.destDir", config.plato.destDir)) {
      config.plato.destDirFull = path.join(config.root, config.plato.destDir);
    }
    if (validators.ifExistsIsObject(errors, "plato.options", config.plato.options)) {
      if (validators.ifExistsIsArray(errors, "plato.options.exclude", config.plato.options.exclude)) {
        regexes = [];
        _ref = config.plato.options.exclude;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          excl = _ref[_i];
          if (excl instanceof RegExp) {
            regexes.push(excl.source);
          } else {
            errors.push("plato.options.exclude must be an array of RegExp");
            break;
          }
        }
        if (errors.length === 0 && regexes.length > 0) {
          config.plato.options.exclude = new RegExp(regexes.join("|"), "i");
        }
      }
      if (validators.ifExistsIsObject(errors, "plato.options.complexity", config.plato.options.complexity)) {
        Object.keys(config.plato.options.complexity).forEach(function(k) {
          return validators.ifExistsIsBoolean(errors, "plato.options.complexity." + k, config.plato.options.complexity[k]);
        });
      }
    }
  }
  return errors;
};
