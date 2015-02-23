/*
 * Copyright 2014-2015 Red Hat, Inc. and/or its affiliates
 * and other contributors as indicated by the @author tags.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var gulp = require('gulp'),
    wiredep = require('wiredep').stream,
    gulpLoadPlugins = require('gulp-load-plugins'),
    map = require('vinyl-map'),
    fs = require('fs'),
    path = require('path'),
    s = require('underscore.string'),
    tslint = require('gulp-tslint'),
    minimist = require('minimist');

var taskCreator = require('./build/gulpfile.js');
var plugins = gulpLoadPlugins({});
var pkg = require('./package.json');
var config = {
  main: '.',
  ts: function (pluginName){ return ['./plugins/' + pluginName + '/plugins/**/*.ts'];},
  templates: function (pluginName){ return ['./plugins/' + pluginName + '/*.html'];},
  templateModule: pkg.name + '-templates',
  dist: './dist/',
  js: function(pluginName){ return pkg.name + '-' + pluginName +'.js'; },
  jsMain: pkg.name +'.js',
  tsProject: plugins.typescript.createProject({
    target: 'ES5',
    module: 'commonjs',
    declarationFiles: true,
    noExternalResolve: false,
    removeComments: true
  }),
  tsLintOptions: {
    rulesDirectory: './tslint-rules/'
  }
};

gulp.task('bower', function () {
  gulp.src('index.html')
    .pipe(wiredep({}))
    .pipe(gulp.dest('.'));
});

function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

var pluginFolders = getFolders('./plugins');
console.log('creating tasks:', pluginFolders);
for (var i = 0; i < pluginFolders.length; i++){
  console.log('creating tasks for ' + pluginFolders[i])
  taskCreator(gulp, config, pluginFolders[i]);
}

gulp.task('default', ['tsc-metrics']);
