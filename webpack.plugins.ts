/**
 * @file defines the webpack plugin configuration for specific CKEditor plugins.
 */

import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import type { WebpackPluginInstance } from 'webpack';

/**
 * Contains the webpack plugins to be used when building specific CKEditor plugins.
 */
const webpackPluginConfig: { [key: string]: WebpackPluginInstance[]; } = {
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
				},
				{
					from: path.resolve(__dirname, 'node_modules/fontawesome6/svgs/solid/icons.svg'),
					to: path.resolve(__dirname, 'icons/icon.svg')
				}
			]
		})
	]
};

export default webpackPluginConfig;
