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
    del = require('del'),
    s = require('underscore.string'),
    tslint = require('gulp-tslint'),
    tslintRules = require('../tslint.json');

  var plugins = gulpLoadPlugins({});
  var isWatch = false;

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
    del(['.tmp/' + pluginName + 'defs.d.ts']);
  });

  //gulp.task('tsc-' + pluginName, ['clean-defs'], function() {
  gulp.task('tsc-' + pluginName, function() {
    var wasError = false;
    var cwd = process.cwd();
    var tsResult = gulp.src(config.ts(pluginName))
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.typescript(plugins.typescript.createProject({
        target: 'ES5',
        module: 'commonjs',
        declarationFiles: true,
        noExternalResolve: false,
        removeComments: true,
        noEmitOnError: false
      }), {}, plugins.typescript.reporter.fullReporter(true)))
      .on('error', function(){
        wasError = true;
      })
      .on('end', function(){
        if(wasError && !isWatch) {
          throw 'Error in one or more TypeScript files. The build is stopped.'
        }
      });

    return eventStream.merge(
      tsResult.js
        .pipe(plugins.plumber({
          handleError: function (err) {
            console.log(err);
            this.emit('end');
          }
        }))
        .pipe(plugins.concat('compiled.js'))
        .pipe(plugins.sourcemaps.write())
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

  gulp.task('tslint-' + pluginName, ['tsc-' + pluginName], function(){
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
        module: config.templateModule(pluginName),
        templateFooter: '}]); hawtioPluginLoader.addModule("' + config.templateModule(pluginName) + '");'
      }))
      .pipe(gulp.dest('.tmp/' + pluginName + '/'));
  });

  gulp.task('less-' + pluginName, function(){
    return gulp.src(config.less(pluginName))
      .pipe(plugins.less())
      .pipe(plugins.concat(config.css(pluginName)))
      .pipe(gulp.dest(config.dist));
  });

  gulp.task('git-sha-' + pluginName, ['template-' + pluginName],function(){
    return plugins.git.exec({args : 'log -n 1 --oneline'}, function (err, stdout) {
      if (err) throw err;

      var versionFile = '.tmp/' + pluginName + 'version.js';
      var gitSha = stdout.slice(0,-1);
      var jsString = 'if (typeof HawkularComponentsVersions !== \'undefined\') { HawkularComponentsVersions.push({name:\''+pluginName+'\', version:\'' + gitSha + '\'})} else {HawkularComponentsVersions = [{name:\''+pluginName+'\', version:\'' + gitSha + '\'}]};';
      fs.writeFileSync(versionFile, jsString);
    });
  });

  gulp.task('concat-' + pluginName, ['git-sha-' + pluginName, 'template-' + pluginName], function() {
    var licenceFile = '.tmp/licence.txt';
    fs.writeFileSync(licenceFile, tslintRules.rules['license-header'][1]);

    return gulp.src([
      licenceFile,
      '.tmp/' + pluginName + 'version.js',
      '.tmp/' + pluginName + '/compiled.js',
      '.tmp/' + pluginName + '/templates.js'])
      .pipe(plugins.sourcemaps.init({loadMaps: true}))
      .pipe(plugins.concat(config.js(pluginName)))
      .pipe(plugins.sourcemaps.write())
      .pipe(gulp.dest(config.dist));
  });

  gulp.task('clean-' + pluginName, ['concat-' + pluginName], function() {
    del(['.tmp/' + pluginName + 'templates.js', '.tmp/' + pluginName + 'compiled.js']);
  });

  gulp.task('watch-' + pluginName, ['build-' + pluginName], function() {

    isWatch = true;

    plugins.watch(['.tmp/gulp-connect-server/index.html', '.tmp/gulp-connect-server/dist/**'], function() {
      gulp.start(['reload']);
    });

    var watchList = [pluginName];
    if (watchList.indexOf('directives') === -1 ){
      watchList.push('directives');
    }

    // For directives
    for(var i =0; i < watchList.length; i++) {
      (function(plugin) {
        plugins.watch(['libs/**/*.d.ts', config.ts(plugin), config.templates(plugin)], function () {
          gulp.start(['tslint-watch-' + plugin, 'tsc-' + plugin, 'template-' + plugin, 'concat-' + plugin,
            'clean-' + plugin, 'connect-prepare-dist-' + plugin]);
        });
        plugins.watch(config.less(plugin), function () {
          gulp.start(['less-' + plugin, 'connect-prepare-dist-' + plugin]);
        });
      })(watchList[i])
    }

    var indexPath = path.resolve(__dirname, '../plugins/' + pluginName + '/index.html');
    plugins.watch(indexPath, function(){
      gulp.start(['bower-' + pluginName]);
    });
  });

  gulp.task('connect-prepare-libs-' + pluginName, ['tsc-' + pluginName, 'template-' + pluginName, 'concat-' + pluginName,
    'clean-' + pluginName], function() {
    var libPath = path.resolve(__dirname, '../libs');

    gulp.src([libPath])
      .pipe(plugins.symlink('.tmp/gulp-connect-server/libs', { force: true }));

  });

  gulp.task('connect-prepare-dist-' + pluginName, ['tsc-' + pluginName, 'template-' + pluginName, 'concat-' + pluginName,
    'clean-' + pluginName], function() {
    var distPath = path.resolve(__dirname, '../dist');

    gulp.src([distPath])
      .pipe(plugins.symlink('.tmp/gulp-connect-server/dist', { force: true }));
  });

  gulp.task('bower-' + pluginName, function () {
    var indexPath = path.resolve(__dirname, '../plugins/' + pluginName + '/index.html');

    gulp.src(indexPath)
      .pipe(wiredep())
      .pipe(gulp.dest('.tmp/gulp-connect-server/'));
  });

  gulp.task('assets-' + pluginName, function () {
    var assets = path.resolve(__dirname, '../plugins/' + pluginName + '/*.json');

    gulp.src(assets)
      .pipe(gulp.dest('.tmp/gulp-connect-server/'));
  });

  gulp.task('connect-' + pluginName, ['connect-prepare-libs-' + pluginName, 'connect-prepare-dist-' + pluginName, 'bower-' + pluginName, 'assets-' + pluginName, 'watch-' + pluginName], function() {
    var staticPath = path.resolve(__dirname, '../.tmp/gulp-connect-server/');

    plugins.connect.server({
      root: staticPath,
      livereload: true,
      port: 2772,
      fallback: staticPath + '/index.html'
    });
  });

  gulp.task('build-' + pluginName, ['path-adjust', 'tsc-' + pluginName, 'tslint-' + pluginName, 'template-' + pluginName,
    'less-' + pluginName, 'concat-' + pluginName, 'clean-' + pluginName]);
};
