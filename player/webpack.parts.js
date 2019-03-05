const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

exports.setupSass = paths => ({
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        include: paths,
      },
    ],
  },
});

exports.extractCSS = paths => ({
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: false,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  autoprefixer({
                    browsers: [
                      'Chrome >= 46',
                      'Firefox ESR',
                      'Edge >= 12',
                      'Explorer >= 9',
                      'iOS >= 8',
                      'Safari >= 8',
                      'Android >= 4',
                    ],
                    cascade: false,
                  }),
                ],
              },
            },
            {
              loader: 'sass-loader',
              options: {
                outputStyle: 'expanded',
              },
            },
          ],
        }),
        include: paths,
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
    }),
  ],
});

exports.devServer = options => ({
  devServer: {
    contentBase: __dirname,
    historyApiFallback: true,
    hot: false,
    inline: true,
    stats: 'errors-only',
    host: options.host,
    port: options.port,
    overlay: {
      warnings: true,
      errors: true,
    },
  },
});

exports.minify = () => ({
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        screw_ie8: true,
      },
      output: {
        comments: false,
      },
    }),
  ],
});

exports.setFreeVariable = (key, value) => {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [new webpack.DefinePlugin(env)],
  };
};
