const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

exports.setupSass = (paths) => ({
	module: {
		loaders: [
			{
				test: /\.scss$/,
				loaders: ['style', 'css', 'sass'],
				include: paths
			}
		]
	}
});

exports.extractCSS = (paths) => ({
	module: {
		loaders: [
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract('style',
					['css?-minimize', 'postcss', 'sass?outputStyle=expanded']
				),
				include: paths
			}
		]
	},
	postcss() {
		return [autoprefixer({
			browsers: [
				'Chrome >= 35',
				'Firefox ESR',
				'Edge >= 12',
				'Explorer >= 9',
				'iOS >= 8',
				'Safari >= 8',
				'Android >= 4'
			],
			cascade: false
		})];
	},
	plugins: [
		new ExtractTextPlugin('[name].css')
	]
});

exports.devServer = (options) => ({
	devServer: {
		historyApiFallback: true,
		hot: true,
		inline: true,
		stats: 'errors-only',
		host: options.host,
		port: options.port
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin({
			multiStep: true
		})
	]
});

exports.minify = () => ({
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				drop_console: true
			}
		})
	]
});

exports.setFreeVariable = (key, value) => {
	const env = {};
	env[key] = JSON.stringify(value);

	return {
		plugins: [
			new webpack.DefinePlugin(env)
		]
	};
};
