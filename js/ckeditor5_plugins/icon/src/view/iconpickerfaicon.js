/**
 * @file contains the icon picker icon for FontAwesome icons.
 * 
 * @typedef { import('../iconconfig').FontAwesomeVersion } FontAwesomeVersion
 * @typedef { import('../iconconfig').IconDefinition } IconDefinition
 * @typedef { import('@types/ckeditor__ckeditor5-utils').Locale } Locale
 */

import { View } from 'ckeditor5/src/ui';
import { getFAStyleClass, getValidIconStyle } from '../iconutils';

export default class IconPickerFAIcon extends View {
	/**
	 * Creates a new IconPickerFAIcon.
	 * 
	 * @param {Locale} locale
	 *   The locale.
	 * @param {FontAwesomeVersion} faVersion
	 *   The version of Font Awesome being used.
	 * @param {string} iconName
	 *   The name of the icon this button is for.
	 * @param {IconDefinition} iconDefinition
	 *   The defintion of the icon this button is for.
	 * @param {string?} iconStyle
	 *   The preferred style to display the icon in (optional).
	 */
	constructor(locale, faVersion, iconName, iconDefinition, iconStyle) {
		super(locale);

		this.setTemplate({
			tag: 'i',
			attributes: {
				class: [
					'ck',
					'ckeditor5-icons__icon',
					getFAStyleClass(faVersion, getValidIconStyle(iconDefinition, iconStyle)),
					'fa-' + iconName
				]
			}
		});
	}
}
