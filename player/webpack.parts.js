const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
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
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  autoprefixer({
                    browsers: ['last 2 versions', '>1%'],
                    cascade: false,
                  }),
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
        include: paths,
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
});

exports.devServer = options => ({
  devServer: {
    static:{
      directory: __dirname,
    },
    historyApiFallback: true,
    hot: false,
    host: options.host,
    port: options.port,
  },
});

exports.minify = () => ({
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: false,
      }),
    ],
  },
});

exports.setFreeVariable = (key, value) => {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [new webpack.DefinePlugin(env)],
  };
};
