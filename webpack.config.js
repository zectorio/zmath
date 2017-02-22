
var path = require('path');

var testConfig = {
  entry : "./test/index",
  output : {
    path : path.resolve(__dirname, "build"),
    filename : "zmath-test.js"
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

var drawConfig = {
  entry : "./test/draw",
  devtool : "inline-source-map",
  output : {
    path : path.resolve(__dirname, "build"),
    filename : "zmath-draw.js"
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

module.exports = drawConfig;
