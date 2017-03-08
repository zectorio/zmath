
var path = require('path');
var BabiliPlugin = require('babili-webpack-plugin');

module.exports = {
  entry : "./index",
  target : 'node',
  output : {
    path : path.resolve(__dirname, "bundle"),
    filename : "zmath.js",
    library : 'zmath',
    libraryTarget : 'commonjs2'
  },
  plugins : [
    new BabiliPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
};

