const settings = require('./application-settings.js');
var webpack = require('webpack'),
  path = require('path'),
  production = process.argv.indexOf('--production') !== -1,
  NgAnnotatePlugin = require('ng-annotate-webpack-plugin'),
  BrowserSyncPlugin = require('browser-sync-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  spa = require('browser-sync-spa'),
  plugins = [
    new CopyWebpackPlugin([
      {from: __dirname + settings.sourceFolder + '/demo/data', to: '../data'},
      {from: __dirname + settings.sourceFolder + '/demo/assets', to: '../assets'}
    ]),
    new webpack.ProvidePlugin({
      angular: 'angular',
      '_': 'lodash'
    }),
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"hawkular-ui-components", /* filename= */"hawkular-ui-components.js"),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 4000,
      server: {baseDir: [__dirname + settings.distFolder]}
    }, {
      use: spa({
        selector: '[ng-app]'
      })
    }),
    new ExtractTextPlugin(settings.stylesheetPath),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new NgAnnotatePlugin({add: true})
  ];

production && plugins.push(new webpack.optimize.UglifyJsPlugin({warnings: false, minimize: true, drop_console: true}));

module.exports = {
  context: __dirname,
  entry: {
    'hawkular-ui-components': [
      settings.sassEntryPoint,
      settings.tsEntryPoint
    ],
    'demo-app': [
      '.' + settings.sourceFolder + '/demo/index.ts',
      '.' + settings.sourceFolder + '/demo/styles/demo-app.scss'
    ]
  },
  output: {
    path: settings.outputFolder,
    publicPath: '/',
    filename: "[name]" + settings.isMinified(production)
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  devtool: !production && 'source-map',
  module: {
    preLoaders: [
      {test: /\.ts$/, loader: 'tslint', exclude: /(node_modules|libs)/}
    ],
    loaders: [
      {test: /\.ts$/, loaders: ['ts-loader'], exclude: /(node_modules|libs)/},
      {test: /\.html$/, loader: 'raw', exclude: /(node_modules|libs|dist|tsd|bower)/},
      // stylesheets
      {test: /\.scss/, exclude: /(node_modules|lib)/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')},
      {test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader')}
    ]
  },
  plugins: plugins,
  externals: {
    'angular': 'angular'
  }
};
