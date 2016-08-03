/* jslint node: true */
/* eslint-env node*/
'use strict'

var gulp = require('gulp')  // Base gulp package
var babelify = require('babelify') // Used to convert ES6 & JSX to ES5
var browserify = require('browserify') // Providers "require" support, CommonJS
var notify = require('gulp-notify') // Provides notification to both the console and Growel
var rename = require('gulp-rename') // Rename sources
var sourcemaps = require('gulp-sourcemaps') // Provide external sourcemap files
var livereload = require('gulp-livereload') // Livereload support for the browser
var gutil = require('gulp-util') // Provides gulp utilities, including logging and beep
var chalk = require('chalk') // Allows for coloring for logging
var source = require('vinyl-source-stream') // Vinyl stream support
var buffer = require('vinyl-buffer') // Vinyl stream support
var watchify = require('watchify') // Watchify for source changes
var merge = require('utils-merge') // Object merge tool
var duration = require('gulp-duration') // Time aspects of your gulp process
var connect = require('connect')
var serverStatic = require('serve-static')
var gulpSass = require('gulp-sass')
var depcheck = require('depcheck') // dependency check
const path = require('path')
// Configuration for Gulp
var config = {
  js: {
    src: './js/app.js',
    watch: './js/**/*',
    outputDir: './build/js/',
    outputFile: 'bundle.js'
  },
  sass: {
    src: './sass/main.scss',
    watch: './sass/**/*',
    outputDir: './build/css/',
    outputFile: 'main.css'
  }
}

// Error reporting function
function mapError (err) {
  if (err.fileName) {
    // Regular error
    gutil.log(chalk.red(err.name) +
      ': ' + chalk.yellow(err.fileName.replace(path.join(__dirname, '/js/'), '')) +
      ': ' + 'Line ' + chalk.magenta(err.lineNumber) +
      ' & ' + 'Column ' + chalk.magenta(err.columnNumber || err.column) +
      ': ' + chalk.blue(err.description))
  } else {
    // Browserify error..
    gutil.log(chalk.red(err.name) +
      ': ' +
      chalk.yellow(err.message))
  }
}

// Completes the final file outputs
function bundle (bundler) {
  var bundleTimer = duration('Javascript bundle time')

  bundler
    .bundle()
    .on('error', mapError) // Map error reporting
    .pipe(source('app.js')) // Set source name
    .pipe(buffer()) // Convert to gulp pipeline
    .pipe(rename(config.js.outputFile)) // Rename the output file
   .pipe(sourcemaps.init({loadMaps: true})) // Extract the inline sourcemaps
   .pipe(sourcemaps.write('./map')) // Set folder for sourcemaps to output to
    .pipe(gulp.dest(config.js.outputDir)) // Set the output folder
    .pipe(notify({
      message: 'Generated file: <%= file.relative %>'
    })) // Output the file being created
    .pipe(bundleTimer) // Output time timing of the file creation
    .pipe(livereload()) // Reload the view in the browser
}

function basicBundler () {
  var args = merge(watchify.args, { debug: true }) // Merge in default watchify args with browserify arguments

  var bundler = browserify(config.js.src, args) // Browserify
    .plugin(watchify, {ignoreWatch: ['**/node_modules/**', '**/bower_components/**'], poll: false}) // Watchify to watch source file changes
    .transform(babelify, {presets: ['es2015', 'react']}) // Babel tranforms

  return bundler
}

function depCheck () {
  depcheck(__dirname, {}, function (unused) {
//  depcheck('/home/fanick/gitrepos/fanick1.github.io',{}, function(unused){
    if (unused.dependencies) {
      console.log('unused dependencies:', unused.dependencies) // an array containing the unused dependencies
    }
    if (unused.devDependencies) {
      console.log('unusued devDependencies:', unused.devDependencies) // an array containing the unused devDependencies
    }
    if (unused.invalidFiles) {
      console.log('unused invalidFiles:', unused.invalidFiles) // files that cannot access or parse
    }
    if (unused.invalidDirs) {
      console.log('unused invalidDirs', unused.invalidDirs) // directories that cannot access
    }
  })
}
gulp.task('styles', function () {
  gulp.src(config.sass.src)
      .pipe(gulpSass().on('error', gulpSass.logError))
      .pipe(rename(config.sass.outputFile))
      .pipe(gulp.dest(config.sass.outputDir))
      .pipe(livereload())
})

// Gulp task for build -- run 'gulp' to start
gulp.task('default', ['styles'], function () {
  livereload.listen() // Start livereload server
  connect().use(serverStatic(__dirname)).listen(8000)
  console.log('Started server on port 8000') // directories that cannot access
  var bundler = basicBundler()
 // TODO true ->add  uglifyify  dependency
  if (true) { // TODO: replace with some proper environment checking
    bundler = bundler
      .transform({
        global: true
      }, 'uglifyify')
  }

  depCheck()

  bundle(bundler) // Run the bundle the first time (required for Watchify to kick in)
  bundler.on('update', function () {
    bundle(bundler) // Re-run bundle on source updates
    depCheck()
  })

  gulp.watch(config.sass.watch, ['styles'])  // start watching scss folder, run styles upon change
})
