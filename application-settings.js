module.exports = {
  stylesFolder: '/styles',
  sourceFolder: '/src',
  distFolder: '/dist',
  javascriptFolder: '/js',
  stylesheetFolder: '/css',
  appName: 'hawkular-ui-components',
  bowerLibs: 'libs/',
  nodePackages: 'node_modules/',
  get stylesheetPath() {
    return '..' + this.stylesheetFolder + '/[name]' + '.css';
  },
  get indexLocation() {
    return __dirname + this.sourceFolder + '/demo/index.html';
  },
  isMinified: function (production) {
    return (!production ? '.js' : '.min.js');
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
