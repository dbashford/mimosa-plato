mimosa-plato
===========
## Overview

When this module is included in Mimosa, it will output a [plato](https://github.com/es-analysis/plato) static analysis report for a `mimosa build`.

For more information regarding Mimosa, see http://mimosa.io.
For more information regarding Plato, see https://github.com/es-analysis/plato

## Usage

Add `'plato'` to your list of modules.  That's all!  Mimosa will install the module for you when you start up.

## Functionality

When you run a `mimosa build`, Mimosa will run the Plato static analyzer tool over your source code.  By default, it will generate its report at `.mimosa/plato/index.html`.

The only way to clean up the plato reports is to expressly remove them on the file system. If the reports are not removed, with each build you will have historical data build up over time. This way you can see the ebb and flow of your apps code complexity.

## Default Config

```coffeescript
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
```

- `destDir` - A string, the location mimosa-plato deposits your reports.
- `excludeVendor` - A boolean, whether or not to exclude the `vendor.javascripts` files as configured in the mimosa-config.
- `options` - An object, configuration for the wrapped [complexityReport](https://github.com/philbooth/complexityReport.js) tool.
- `options.exclude` - An array, the regexes provided are combined into a single regex and any file names (absolute) that match the combined regex are excluded from report generation
- `options.complexity` - An object with boolean entries. See the [complexityReport](https://github.com/philbooth/complexityReport.js#calling-the-library) docs for details on the values.
- `options.jshint` - A config for jshint.  Set to `false` if you don't wish jshint to be used. jshint configuration (an object with boolean entries) can be placed directly in here. Or you can put a string path relative to project root to your .jshintrc file.