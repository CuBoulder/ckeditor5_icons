/**
 * @file defines configuration for the icon plugin.
 * 
 * @typedef { '5' | '6' } FontAwesomeVersion
 * @typedef { { 'icons': string[], 'label': string } } CategoryDefinition
 * @typedef { { 'styles': string[], 'label': string, 'search': { 'terms': string[] } } } IconDefinition
 * 
 * @typedef {Object} SelectableOption
 * @property {string} label
 * @property {string?} icon
 * @property {string?} className
 */

import { icons } from 'ckeditor5/src/core';

/** @type {Object<string, SelectableOption>} */
export const sizeOptions = {
	small: {
		label: 'Small',
		icon: icons.objectSizeSmall,
		className: 'fa-sm'
	},
	regular: {
		label: 'Regular',
		icon: icons.objectSizeMedium
	},
	large: {
		label: 'Large',
		icon: icons.objectSizeLarge,
		className: 'fa-lg'
	},
	extraLarge: {
		label: 'Extra large',
		icon: icons.objectSizeFull,
		className: 'fa-xl'
	},
	'2x': {
		label: '2x',
		className: 'fa-2x'
	},
	'3x': {
		label: '3x',
		className: 'fa-3x'
	},
	'4x': {
		label: '4x',
		className: 'fa-4x'
	},
	'5x': {
		label: '5x',
		className: 'fa-5x'
	},
	'6x': {
		label: '6x',
		className: 'fa-6x'
	},
	'7x': {
		label: '7x',
		className: 'fa-7x'
	},
	'8x': {
		label: '8x',
		className: 'fa-8x'
	},
	'9x': {
		label: '9x',
		className: 'fa-9x'
	},
	'10x': {
		label: '10x',
		className: 'fa-10x'
	}
};

export const sizeDefault = 'regular';

/** @type {Object<string, SelectableOption>} */
export const alignmentOptions = {
	none: {
		label: 'With text',
		icon: icons.objectCenter
	},
	left: {
		label: 'Pull left',
		icon: icons.objectLeft,
		className: 'fa-pull-left'
	},
	right: {
		label: 'Pull right',
		icon: icons.objectRight,
		className: 'fa-pull-right'
	}
};

export const alignmentDefault = 'none';

/**
 * Labels for all the style options.
 */
export const faStyleLabels = {
	'solid': 'Solid',
	'regular': 'Regular',
	'light': 'Light',
	'thin': 'Thin',
	'duotone': 'Duotone',
	'brands': 'Brands'
}

/**
 * A definition of Font Awesome style classes by version.
 */
export const faStylesByVersion = {
	'6': {
		'solid': 'fa-solid',
		'regular': 'fa-regular',
		'light': 'fa-light',
		'thin': 'fa-thin',
		'duotone': 'fa-duotone',
		'brands': 'fa-brands'
	},
	'5': {
		'solid': 'fas',
		'regular': 'far',
		'light': 'fal',
		'duotone': 'fad',
		'brands': 'fab'
	}
};
