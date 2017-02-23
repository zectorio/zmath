
var path = require('path');

module.exports = {
  entry : "./index",
  target : 'node',
  output : {
    path : path.resolve(__dirname, "bundle"),
    filename : "zmath.js",
    library : 'zmath',
    libraryTarget : 'commonjs2'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
};

