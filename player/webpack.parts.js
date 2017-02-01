const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

exports.setupSass = paths => ({
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
				include: paths
			}
		]
	}
});

exports.extractCSS = paths => ({
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallbackLoader: 'style-loader',
					loader: [
						{
							loader: 'css-loader',
							options: {
								minimize: false,
								importLoaders: 2
							}
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
											'Android >= 4'
										],
										cascade: false
									})
								]
							}
						},
						{
							loader: 'sass-loader',
							options: {
								outputStyle: 'expanded'
							}
						}
					]
				}),
				include: paths
			}
		]
	},
	plugins: [
		new ExtractTextPlugin({
			filename: '[name].css'
		})
	]
});

exports.devServer = options => ({
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
				drop_console: true,
				screw_ie8: true
			},
			output: {
				comments: false
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
