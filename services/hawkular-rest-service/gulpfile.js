'use strict';

var gulp = require('gulp');

gulp.paths = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e'
};

require('require-dir')('./gulp');

var $ = require('gulp-load-plugins')();

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
