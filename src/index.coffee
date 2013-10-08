"use strict"

fs = require 'fs'

plato = require 'plato'
wrench = require 'wrench'
logger = require 'logmimosa'

config = require './config'

files = []

registration = (mimosaConfig, register) ->
  if mimosaConfig.isBuild
    e = mimosaConfig.extensions
    register ['buildFile'], 'afterWrite', _assembleFiles, e.javascript
    register ['postBuild'], 'init', _runPlato

_assembleFiles = (mimosaConfig, options, next) ->
  options.files.forEach (file) ->
    unless mimosaConfig.plato.excludeVendor and file.inputFileName.indexOf(mimosaConfig.vendor.javascripts) is 0
      files.push file.outputFileName
  next()

_runPlato = (mimosaConfig, options, next) ->
  if files.length > 0
    if logger.isDebug
      logger.debug "Running plato on #{JSON.stringify(files, 0, null)}"
    plato.inspect files, mimosaConfig.plato.destDirFull, mimosaConfig.plato.options, next
  else
    next()

module.exports =
  registration:    registration
  defaults:        config.defaults
  placeholder:     config.placeholder
  validate:        config.validate