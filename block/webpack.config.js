const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

const NODE_ENV = process.env.NODE_ENV || 'development';

const recursiveIssuer = m => {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else if (m.name) {
    return m.name;
  }

  return false;
};

const wplib = [
  'blocks',
  'components',
  'date',
  'editor',
  'blockEditor',
  'element',
  'i18n',
  'data',
  'compose',
  'keycodes',
  'htmlEntities',
  'serverSideRender',
  'icons',
];

const webpackConfig = {
  mode: NODE_ENV,
  entry: {
    block: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    library: ['wp', '[name]'],
    libraryTarget: 'window',
  },
  // Define WordPress external libraries loaded globally
  // as separate scripts so that we can use them as ES modules
  externals: wplib.reduce(
    (externals, lib) => {
      externals[`wp.${lib}`] = {
        window: ['wp', lib],
      };

      return externals;
    },
    {
      // Initial externals (non WP libraries)
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  ),
  optimization: {
    // https://github.com/webpack-contrib/mini-css-extract-plugin#extracting-css-based-on-entry
    splitChunks: {
      cacheGroups: {
        editorStyles: {
          name: 'block',
          test: (m, c, entry = 'block') =>
            m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: /node_modules/,
      },
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoprefixer({
                  browsers: ['last 2 versions'],
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
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  devtool: 'eval-source-map',
};

if (NODE_ENV === 'production') {
  delete webpackConfig.devtool;
}

module.exports = webpackConfig;
