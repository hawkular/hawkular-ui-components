'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');

var paths = gulp.paths;

function runTests (singleRun) {
  var bowerDeps = wiredep({
    directory: 'bower_components',
    exclude: ['bootstrap-sass-official'],
    dependencies: true,
    devDependencies: true
  });

  var testFiles = bowerDeps.js.concat([
    paths.src + '/*.spec.js',
    paths.dist + '/*.js'
  ]);

  gulp.src(testFiles)
    .pipe($.karma({
      configFile: 'karma.conf.js',
      action: (singleRun)? 'run': 'watch'
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      console.log(err);
      throw err;
    });
}

function runTestsRest (singleRun) {
  var bowerDeps = wiredep({
    directory: 'bower_components',
    exclude: ['bootstrap-sass-official'],
    dependencies: true,
    devDependencies: true
  });

  var testFiles = bowerDeps.js.concat([
    paths.src + '/*.spec.rest.js',
    paths.dist + '/*.js'
  ]);

  gulp.src(testFiles)
    .pipe($.karma({
      configFile: 'karma.conf.js',
      action: (singleRun)? 'run': 'watch'
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      console.log(err);
      throw err;
    });
}

gulp.task('test', ['scripts'], function (done) { runTests(true /* singleRun */, done) });
gulp.task('test:auto', ['scripts'], function (done) { runTests(false /* singleRun */, done) });

gulp.task('rest', ['scripts'], function (done) { runTestsRest(true /* singleRun */, done) });
