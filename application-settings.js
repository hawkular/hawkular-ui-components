module.exports = {
  stylesFolder: '/styles',
  sourceFolder: '/src',
  distFolder: '/dist',
  javascriptFolder: '/js',
  stylesheetFolder: '/css',
  appName: 'hawkular-ui-components',
  get stylesheetPath() {
    return '..' + this.stylesheetFolder + '/' + this.appName + '.css';
  },
  get indexLocation() {
    return __dirname + this.sourceFolder + '/index.html';
  },
  appNameByProduction: function (production) {
    return this.appName + (!production ? '.js' : '.min.js');
  },
  get lessEntryPoint() {
    return '.' + this.sourceFolder + this.stylesFolder + '/' + this.appName + '.less'
  },
  get tsEntryPoint() {
    return '.' + this.sourceFolder + '/index.ts'
  },
  get outputFolder() {
    return __dirname + this.distFolder + this.javascriptFolder
  }
};
