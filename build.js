var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function build(watch, params)
{
  var nodeModules = {};
  fs.readdirSync(params.node_modules)
    .filter(function(x) {
      return ['.bin', 'cmmn'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
      nodeModules[mod] = 'commonjs ' + mod;
    });
  var clientNodeModules = {};
  const ext = params.clientExterns || [];
  fs.readdirSync(params.node_modules)
    .filter(function(x) {
      return ext.concat(['.bin', 'cmmn']).indexOf(x) === -1;
    })
    .forEach(function(mod) {
      nodeModules[mod] = 'commonjs ' + mod;
    });

  const fileRegex = /\.(png|jpg|jpeg|svg|woff2?|ttf|eot|otf|php)(\?.*)?$/;

  const webpackConfig = [
    {
      entry: ['babel-regenerator-runtime', params.entry],
      target: 'node',
      devtool: 'source-map',
      externals: nodeModules,
      output: {
        path: path.join(params.buildDir, 'public'),
        filename: '../entry.js'
      },
      resolve: {
        alias: {
          cmmn: path.join(__dirname, 'runtime', 'index.js'),
          'cmmn-router': params.router,
          'cmmn-datasource': params.datasource
        }
      },
      resolveLoader: {
        modulesDirectories: ['node_modules/cmmn/loaders', 'node_modules']
      },
      module: {
        preLoaders: [
          {
            test: /\.scss$/,
            loader: 'sass'
          }
        ],
        loaders: [
          {
            test: /\.jsx?$/,
            //exclude: /node_modules/,
            loader: 'babel',
            query: {
              presets: ['es2015'],
              plugins: ['transform-async-to-generator', ['transform-react-jsx', {
                pragma: 'createElement'
              }]]
            }
          },
          {
            test: /\.s?css$/,
            loader: 'locals!css?modules&localIdentName=[path][name]---[local]---[hash:base64:5]'
            // loader: ExtractTextPlugin.extract('style', 'css?modules')
          },
          {
            test: fileRegex,
            loader: 'file',
            query: {
              name: '[ext]/[name]-[md5:hash:base64:8].[ext]',
              publicPath: params.publicPath
            }
          }
        ],
        postLoaders: [
          {
            test: /\.s?css$/,
            loader: 'bem'
          }
        ]
      },
      plugins: [
        new webpack.BannerPlugin(
          'require("source-map-support").install();',
          { raw: true, entryOnly: false }
        ),
        new webpack.DefinePlugin({
          CMMN_PUBLIC_PATH: '\'' + params.publicPath + '\''
        })
      ]
    }, {
      entry: [path.join(__dirname, 'client-entry.js')],
      externals: clientNodeModules,
      output: {
        path: path.join(params.buildDir, 'public'),
        filename: 'scripts.js'
      },
      resolve: {
        alias: {
          cmmn: path.join(__dirname, 'runtime', 'index.js'),
          'cmmn-router': params.router,
          'cmmn-datasource': params.datasource
        }
      },
      resolveLoader: {
        modulesDirectories: ['node_modules/cmmn/loaders', 'node_modules']
      },
      module: {
        preLoaders: [
          {
            test: /\.scss$/,
            loader: 'sass'
          }
        ],
        loaders: [
          {
            test: /\.jsx?$/,
            //exclude: /node_modules/,
            loader: 'babel',
            query: {
              presets: ['es2015'],
              plugins: ['transform-async-to-generator', ['transform-react-jsx', {
                pragma: 'createElement'
              }]]
            }
          },
          {
            test: /\.s?css$/,
            // loader: 'locals!css?modules'
            loader: ExtractTextPlugin.extract('style', 'css?modules&sourceMap&localIdentName=[path][name]---[local]---[hash:base64:5]')
          },
          {
            test: fileRegex,
            loader: 'file',
            query: {
              name: '[ext]/[name]-[md5:hash:base64:8].[ext]',
              publicPath: params.publicPath
            }
          }
        ],
        postLoaders: [
          {
            test: /\.s?css$/,
            loader: 'bem'
          }
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          CMMN_PUBLIC_PATH: '\'' + params.publicPath + '\''
        }),
        new ExtractTextPlugin("./styles.css")
      ]
    }
  ];

  if (watch) {
    var compiler = webpack(webpackConfig);
    return new Promise(function (resolve, reject) {
      compiler.watch({
        // watch options
      }, function (err, stats) {
        if (err) reject(err); else resolve(stats);
      });
    });
  } else {
    return new Promise(function (resolve, reject) {
      webpack(webpackConfig, function (err, stats) {
        if (err) reject(err); else resolve(stats);
      });
    });
  }
}
