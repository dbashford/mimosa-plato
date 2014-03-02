"use strict";
var fs, path;

path = require('path');

fs = require('fs');

exports.defaults = function() {
  return {
    plato: {
      destDir: ".mimosa/plato",
      excludeVendor: true,
      options: {
        jshint: {},
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
  return "\t\n\n  plato:                        # Config for mimosa-plato module\n    destDir: \".mimosa/plato\"    # Location to write plato static analysis report\n    excludeVendor: true         # Whether or not to exclude files in the vendor.javascripts dir\n    options:\n      jshint: {}                # A config for jshint.  Set to `false` if you don't wish jshint\n                                # to be used. jshint configuration (an object with boolean\n                                # entries) can be placed directly in here. Or you can put a\n                                # string path to your .jshintrc file relative to project root.\n      exclude: [/\\.min\\.js$/] # an array of regexes to match files to exclude from processing\n      complexity:               # Complexity rule configuration, see:\n                                # https://github.com/philbooth/complexityReport.js#calling-the-library\n        newmi: true             # Default complexity rule\n        trycatch: true          # Default complexity rule\n        forin: true             # Default complexity rule\n";
};

exports.validate = function(config, validators) {
  var err, errors, excl, hintText, hintrcPath, regexes, _i, _len, _ref;
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
      if (config.plato.options.jshint != null) {
        if (typeof config.plato.options.jshint === "string") {
          hintrcPath = path.join(config.root, config.plato.options.jshint);
          if (fs.existsSync(hintrcPath)) {
            hintText = fs.readFileSync(hintrcPath);
            try {
              config.plato.options.jshint = JSON.parse(hintText);
            } catch (_error) {
              err = _error;
              throw "Cannot parse jshintrc file at [[ " + hintrcPath + " ]], " + err;
            }
          } else {
            errors.push("Cannot find jshintrc file at [[ " + hintrcPath + " ]]");
          }
        }
        config.plato.options.jshint = {
          options: config.plato.options.jshint
        };
      }
    }
  }
  return errors;
};
