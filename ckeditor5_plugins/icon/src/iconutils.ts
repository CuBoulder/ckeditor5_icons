/** 
 * @file defines helper functions for the icon plugin.
 */

import type { Element, DocumentSelection } from 'ckeditor5/src/engine';
import type { FontAwesomeVersion, FontAwesomeStyle, IconDefinition } from './icontypes';
import { faStyleClassByVersion } from './iconconfig';

/**
 * @param selection 
 *   The selection.
 * @returns
 *   The selected icon widget, or null if there isn't one.
 */
export function getSelectedIconWidget(selection: DocumentSelection): Element | null {
	const selectedElement = selection.getSelectedElement();

	if (selectedElement && selectedElement.is('element') && isIconWidget(selectedElement))
		return selectedElement;

	return null;
}

/**
 * @param iconDefinition 
 * @param iconStyle
 * @returns {FontAwesomeStyle}
 *   A valid icon style for this icon definition.
 *   If `null` or an invalid value is supplied to `iconStyle`, the first style supported by the icon will be returned.
 */
export function getValidIconStyle(iconDefinition: IconDefinition, iconStyle?: FontAwesomeStyle | null): FontAwesomeStyle {
	const styles = iconDefinition.styles;

	let styleIndex = 0;
	if (iconStyle) {
		const _styleIndex = styles.indexOf(iconStyle);
		if (_styleIndex !== -1)
			styleIndex = _styleIndex;
	}

	return styles[styleIndex]!;
}

/**
 * @param faVersion 
 * @param iconStyle
 * @returns
 *   The correct style class for the specified Font Awesome version and icon style.
 */
export function getFAStyleClass(faVersion: FontAwesomeVersion, iconStyle: FontAwesomeStyle): string {
	return faStyleClassByVersion[faVersion][iconStyle] || 'fas';
}

/**
 * @param element 
 * @returns
 *   Whether the element is a icon widget.
 */
function isIconWidget(element: Element): boolean {
	return element.name === 'icon';
}
