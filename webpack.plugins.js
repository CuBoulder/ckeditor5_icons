/**
 * @file Defines the Webpack plugins to be used when building specific CKEditor plugins.
 */

const
	path = require('path'),
	CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	icon: [
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, 'node_modules/fontawesome6/metadata/(categories|icons).yml'),
					to: path.resolve(__dirname, 'libraries/fontawesome6/metadata/[name][ext]')
				},
				{
					from: path.resolve(__dirname, 'node_modules/fontawesome5/metadata/(categories|icons).yml'),
					to: path.resolve(__dirname, 'libraries/fontawesome5/metadata/[name][ext]')
				}
			]
		})
	]
};
