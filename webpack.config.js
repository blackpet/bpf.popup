const path = require('path');

module.exports = (env, options) => {
  const config = {

    // devtool: options.mode === 'development' ? 'inline-source-map' : '',

    entry: {
      'bpf.video': ['@babel/polyfill', 'video.js', './src/bpf.video.js'],
    },

    output: {
      filename: '[name].js',
      path: path.resolve(__dirname),
      library: ['bpf', 'popup'],
      libraryTarget: 'umd',
    },

    module: {
      rules: [
        {
          test: /\.js$/i,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-arrow-functions']
            }
          }
        },

        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        }
      ]
    }
  };

  if (options.mode === 'development') {
    // TODO blackpet: development settings...

    config.devtool = 'inline-source-map';

    // webpack-dev-server settings
    config.devServer = {
      contentBase: path.join(__dirname),
      host: '0.0.0.0',
      port: 4001,
      hot: true,
      // open: true,
      proxy: {
        '/admin': {
          target: 'http://localhost:8080'
        }
      },
    }
  } else {
    // TODO blackpet: production settings...
  }

  return config;
};
