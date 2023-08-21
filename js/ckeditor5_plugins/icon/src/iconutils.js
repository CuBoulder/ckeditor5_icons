/** 
 * @file defines helper functions for the icon plugin.
 * 
 * @typedef { import('./iconconfig').FontAwesomeVersion } FontAwesomeVersion
 * @typedef { import('./iconconfig').IconDefinition } IconDefinition
 * @typedef { import('@ckeditor/ckeditor5-engine').Element } Element
 * @typedef { import('@ckeditor/ckeditor5-engine').DocumentSelection } DocumentSelection
 */

import { faStylesByVersion } from './iconconfig';

/**
 * @param {DocumentSelection} selection 
 *   The selection.
 * @returns {Element | null}
 *   The selected icon widget, or null if there isn't one.
 */
export function getSelectedIconWidget(selection) {
	const selectedElement = selection.getSelectedElement();

	if (selectedElement && selectedElement.is('element') && isIconWidget(selectedElement))
		return selectedElement;

	return null;
}

/**
 * @param {IconDefinition} iconDefinition 
 * @param {string?} iconStyle
 * @returns {string}
 *   A valid icon style for this icon definition.
 *   If `null` or an invalid value is supplied to `iconStyle`, the first style supported by the icon will be returned.
 */
export function getValidIconStyle(iconDefinition, iconStyle) {
	const styles = iconDefinition.styles;

	let styleIndex = 0;
	if (iconStyle) {
		const _styleIndex = styles.indexOf(iconStyle);
		if (_styleIndex !== -1)
			styleIndex = _styleIndex;
	}

	return styles[styleIndex];
}

/**
 * @param {FontAwesomeVersion} faVersion 
 * @param {string?} iconStyle
 * @returns {string}
 *   The correct style class for the specified Font Awesome version and icon style.
 */
 export function getFAStyleClass(faVersion, iconStyle) {
	return faStylesByVersion[faVersion][iconStyle];
}

/**
 * @param {Element} element 
 * @returns {boolean}
 *   Whether the element is a icon widget.
 */
function isIconWidget(element) {
	return element.name === 'icon';
}
