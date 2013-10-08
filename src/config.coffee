"use strict"

path = require 'path'
fs = require 'fs'

exports.defaults = ->
  plato:
    destDir: ".mimosa/plato"
    excludeVendor: true
    options:
      jshint: {}
      exclude: [/\.min\.js$/]
      complexity:
        newmi: true
        trycatch: true
        forin: true

exports.placeholder = ->
  """
  \t

    # plato:                        # Config for mimosa-plato module
      # destDir: ".mimosa/plato"    # Location to write plato static analysis report
      # excludeVendor: true         # Whether or not to exclude files in the vendor.javascripts dir
      # options:
        # jshint: {}                # A config for jshint.  Set to `false` if you don't wish jshint
                                    # to be used. jshint configuration (an object with boolean
                                    # entries) can be placed directly in here. Or you can put a
                                    # string path to your .jshintrc file relative to project root.
        # exclude: [/\\.min\\.js$/] # an array of regexes to match files to exclude from processing
        # complexity:               # Complexity rule configuration, see:
                                    # https://github.com/philbooth/complexityReport.js#calling-the-library
          # newmi: true             # Default complexity rule
          # trycatch: true          # Default complexity rule
          # forin: true             # Default complexity rule

  """

exports.validate = (config, validators) ->
  errors = []
  if validators.ifExistsIsObject(errors, "plato config", config.plato)
    validators.ifExistsIsBoolean(errors, "plato.excludeVendor", config.plato.excludeVendor)
    if validators.ifExistsIsString(errors, "plato.destDir", config.plato.destDir)
      config.plato.destDirFull = path.join config.root, config.plato.destDir

    if validators.ifExistsIsObject(errors, "plato.options", config.plato.options)
      if validators.ifExistsIsArray(errors, "plato.options.exclude", config.plato.options.exclude)
        regexes = []
        for excl in config.plato.options.exclude
          if excl instanceof RegExp
            regexes.push excl.source
          else
            errors.push "plato.options.exclude must be an array of RegExp"
            break

        if errors.length is 0 and regexes.length > 0
          config.plato.options.exclude = new RegExp regexes.join("|"), "i"

      if validators.ifExistsIsObject(errors, "plato.options.complexity", config.plato.options.complexity)
        Object.keys(config.plato.options.complexity).forEach (k) ->
          validators.ifExistsIsBoolean(errors, "plato.options.complexity.#{k}", config.plato.options.complexity[k])

      if config.plato.options.jshint?
        if typeof config.plato.options.jshint is "string"
          hintrcPath = path.join config.root, config.plato.options.jshint
          if fs.existsSync hintrcPath
            hintText = fs.readFileSync hintrcPath
            try
              config.plato.options.jshint = JSON.parse hintText
            catch err
              throw "Cannot parse jshintrc file at [[ #{hintrcPath} ]], #{err}"
          else
            errors.push "Cannot find jshintrc file at [[ #{hintrcPath} ]]"

        config.plato.options.jshint =
          options: config.plato.options.jshint


  errors