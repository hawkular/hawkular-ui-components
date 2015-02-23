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

module.exports = function(gulp, config, pluginName){

  var  wiredep = require('wiredep').stream,
    eventStream = require('event-stream'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    map = require('vinyl-map'),
    fs = require('fs'),
    path = require('path'),
    s = require('underscore.string'),
    tslint = require('gulp-tslint'),
    tslintRules = require('../tslint.json');

  var plugins = gulpLoadPlugins({});

  /** Adjust the reference path of any typescript-built plugin this project depends on */
  gulp.task('path-adjust', function() {
    gulp.src('libs/**/includes.d.ts')
      .pipe(map(function(buf, filename) {
        var textContent = buf.toString();
        var newTextContent = textContent.replace(/"\.\.\/libs/gm, '"../../../libs');
        // console.log("Filename: ", filename, " old: ", textContent, " new:", newTextContent);
        return newTextContent;
      }))
      .pipe(gulp.dest('libs'));
  });

  gulp.task('clean-defs', function() {
    return gulp.src('defs.d.ts', { read: false })
      .pipe(plugins.clean());
  });

  //gulp.task('tsc-' + pluginName, ['clean-defs'], function() {
  gulp.task('tsc-' + pluginName, function() {
    var cwd = process.cwd();
    var tsResult = gulp.src(config.ts(pluginName))
      .pipe(plugins.typescript(plugins.typescript.createProject({
        target: 'ES5',
        module: 'commonjs',
        declarationFiles: true,
        noExternalResolve: false,
        removeComments: true
      })))
      .on('error', plugins.notify.onError({
        message: 'Error: <%= error.message %>',
        title: 'Typescript compilation error'
      }));

    return eventStream.merge(
      tsResult.js
        .pipe(plugins.plumber({
          handleError: function (err) {
            console.log(err);
            this.emit('end');
          }
        }))
        .pipe(plugins.concat('compiled.js'))
        .pipe(gulp.dest('.tmp/' + pluginName + '/')),

      tsResult.dts.pipe(gulp.dest('.tmp/' + pluginName + '/d.ts')))
      .pipe(map(function(buf, filename) {
        if (!s.endsWith(filename, 'd.ts')) {
          return buf;
        }
        var relative = path.relative(cwd, filename);
        fs.appendFileSync('.tmp/' + pluginName + '/defs.d.ts', '/// <reference path="' + relative + '"/>\n');
        return buf;
      }));
  });

  gulp.task('tslint-' + pluginName, function(){
    gulp.src(config.ts(pluginName))
      .pipe(tslint(config.tsLintOptions))
      .pipe(tslint.report('verbose'));
  });

  gulp.task('tslint-watch-' + pluginName, function(){
    gulp.src(config.ts(pluginName))
      .pipe(tslint(config.tsLintOptions))
      .pipe(tslint.report('prose', {
        emitError: false
      }));
  });

  gulp.task('template-' + pluginName, ['tsc-' + pluginName], function() {
    return gulp.src(config.templates(pluginName))
      .pipe(plugins.angularTemplatecache({
        filename: 'templates.js',
        root: 'plugins/',
        standalone: true,
        module: config.templateModule,
        templateFooter: '}]); hawtioPluginLoader.addModule("' + config.templateModule + '");'
      }))
      .pipe(gulp.dest('.tmp/' + pluginName + '/'));
  });

  gulp.task('concat-' + pluginName, ['template-' + pluginName], function() {
    var license = tslintRules.rules['license-header'][1];
    return gulp.src([
      '.tmp/' + pluginName + '/compiled.js',
      '.tmp/' + pluginName + '/templates.js'])
      .pipe(plugins.concat(config.js(pluginName)))
      .pipe(plugins.header(license))
      .pipe(gulp.dest(config.dist));
  });

  gulp.task('clean-' + pluginName, ['concat-' + pluginName], function() {
    return gulp.src(['templates.js', 'compiled.js'], { read: false })
      .pipe(plugins.clean());
  });

  gulp.task('watch-' + pluginName, ['build-' + pluginName], function() {
    plugins.watch(['libs/**/*.js', 'libs/**/*.css', 'index.html', config.dist + '/' + config.js], function() {
      gulp.start('reload');
    });
    plugins.watch(['libs/**/*.d.ts', config.ts(pluginName), config.templates], function() {
      gulp.start(['tslint-watch', 'tsc', 'template', 'concat', 'clean']);
    });
  });

  gulp.task('connect-' + pluginName, ['watch-' + pluginName], function() {
    console.log('./plugins/' + pluginName);

    plugins.connect.server({
      root: './plugins/' + pluginName,
      livereload: true,
      port: 2772,
      fallback: 'index.html'
    });
  });

  gulp.task('reload-' + pluginName, function() {
    gulp.src('.')
      .pipe(plugins.connect.reload());
  });

  console.log('creating ', 'build-' + pluginName);
  gulp.task('build-' + pluginName, ['bower', 'path-adjust', 'tslint-' + pluginName, 'tsc-' + pluginName, 'template-' + pluginName, 'concat-' + pluginName, 'clean-' + pluginName]);

  gulp.task('default', ['connect-' + pluginName]);
};