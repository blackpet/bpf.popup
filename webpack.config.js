const path = require('path');

module.exports = (env, options) => {
  const config = {

    // devtool: options.mode === 'development' ? 'inline-source-map' : '',

    entry: {
      'bpf.popup': ['@babel/polyfill', './src/bpf.poppy.js'],
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
      port: 4002,
      hot: true,
      // open: true,
      // proxy: {
      //   '/admin': {
      //     target: 'http://localhost:8080'
      //   }
      // },
      setup(app) {
        app.post('*', (req, res) => {
          res.redirect(req.originalUrl);
        });
      },
    }
  } else {
    // TODO blackpet: production settings...
  }

  return config;
};
