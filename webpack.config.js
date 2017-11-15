const path = require('path');


module.exports = {
  // the entry file for the bundle
  entry: path.join(__dirname, '/client/src/app.jsx'),
  resolve: {
  modules: [
    path.join(__dirname, "node_modules")
  ]
},

  // the bundle file we will get in the result
  output: {
    path: path.join(__dirname, '/client/dist/js'),
    filename: 'app.js',
  },
  

  module: {
      preLoaders: [
        { test: /\.json$/, loader: 'json'},
    ],
    // apply loaders to files that meet given conditions
    loaders: [{
      test: /\.jsx?$/,
      include: path.join(__dirname, '/client/src'),
      loader: 'babel',
      query: {
        presets: ["react", "es2015"]
      }
    }],
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  // start Webpack in a watch mode, so Webpack will rebuild the bundle on changes
  watch: true
};
