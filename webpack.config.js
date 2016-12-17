const webpack = require('webpack');
const isProd = process.env.NODE_ENV === 'production';

console.log(isProd ? 'Production mode' : 'Development mode');

module.exports = {
  devtool: isProd ? false : 'source-map',
  entry: './src/app.js',
  output: {
    path: __dirname + '/build',
    filename: 'app.bundle.js'
  },
  target: 'web',
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    }]
  },
  externals: [
    function(ctx, req, cb) {
      if (/.*\/physics.*/g.test(req)) return cb(null, 'var false');
      cb();
    }
  ],
  plugins: isProd ? [
    new webpack.optimize.UglifyJsPlugin()
    // new webpack.optimize.DedupePlugin()
  ] : [],
  devServer: {
    publicPath: '/build'
  }
};
