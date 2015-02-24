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
    fs = require('fs'),
    path = require('path');

var taskCreator = require('./build/gulpfile.js');
var plugins = gulpLoadPlugins({});
var pkg = require('./package.json');

var config = {
  main: '.',
  ts: function (pluginName){ return ['./plugins/' + pluginName + '/plugins/**/*.ts'];},
  templates: function (pluginName){ return ['./plugins/' + pluginName + '/plugins/**/*.html'];},
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

gulp.task('clean', function() {
  return gulp.src(['.tmp'], { read: false })
    .pipe(plugins.clean());
});

gulp.task('bower', function () {
  gulp.src('./tmp/gulp-server-connect/index.html')
    .pipe(wiredep({}))
    .pipe(gulp.dest('.'));
});

function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

var pluginBuildTasks = [];
var pluginFolders = getFolders('./plugins');

for (var i = 0; i < pluginFolders.length; i++){
  var pluginName = pluginFolders[i];
  taskCreator(gulp, config, pluginName);
  pluginBuildTasks.push('build-' + pluginName);
}

gulp.task('default', pluginBuildTasks);
