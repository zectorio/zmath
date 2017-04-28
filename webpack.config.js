
var path = require('path');
var BabiliPlugin = require('babili-webpack-plugin');

let indexConfig = {
  entry : "./test/index",
  devtool : "inline-source-map",
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

let mochaConfig = {
  entry : "./test/mocha",
  devtool : "inline-source-map",
  output : {
    path : path.resolve(__dirname, "build"),
    filename : "zmath-mocha.js"
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


let bundleConfig = {
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

module.exports = indexConfig;
