const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const parts = require('./webpack.parts');

const TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;

const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build'),
  style: path.join(__dirname, 'styles', 'style.scss'),
};

const common = {
  entry: {
    style: PATHS.style,
    app: PATHS.app,
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'AudioIgniter',
      template: `${PATHS.app}/index.ejs`,
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader?cacheDirectory'],
        include: PATHS.app,
      },
    ],
  },
};

let config;

// Detect how npm is run and branch based on that
switch (TARGET) {
  case 'build': {
    config = merge(
      common,
      {
        resolve: {
          modules: [path.resolve(__dirname), 'node_modules'],
          extensions: ['.js', '.jsx'],
        },
      },
      parts.minify(),
      parts.extractCSS(PATHS.style),
      parts.setFreeVariable('process.env.NODE_ENV', 'production'),
    );
    break;
  }
  default: {
    config = merge(
      common,
      {
        devtool: 'eval-source-map',
      },
      parts.setupSass(PATHS.style),
      parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT,
      }),
    );
  }
}

module.exports = config;
