const settings = require('./application-settings.js');
var webpack = require('webpack'),
  path = require('path'),
  production = process.argv.indexOf('--production') !== -1,
  NgAnnotatePlugin = require('ng-annotate-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  BrowserSyncPlugin = require('browser-sync-webpack-plugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  spa = require('browser-sync-spa'),
  plugins = [
    new CopyWebpackPlugin([
      {from: settings.indexLocation, to: __dirname + '/..'}
    ]),
    new webpack.ProvidePlugin({
      angular: 'angular',
      '_': 'lodash'
    }),
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
    app: [
      settings.lessEntryPoint,
      settings.tsEntryPoint
    ]
  },
  output: {
    path: settings.outputFolder,
    publicPath: '/',
    filename: settings.appNameByProduction(production)
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
      {test: /\.less$/, exclude: /(node_modules|lib)/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader')},
      {test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')}
    ]
  },
  plugins: plugins,
  externals: {
    'angular': 'angular'
  }
};
