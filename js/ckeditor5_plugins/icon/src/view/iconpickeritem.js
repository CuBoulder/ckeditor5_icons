/**
 * @file contains the icon picker grid button for FontAwesome icons.
 * 
 * @typedef { import('../iconconfig').FontAwesomeVersion } FontAwesomeVersion
 * @typedef { import('../iconconfig').IconDefinition } IconDefinition
 * @typedef { import('@ckeditor/ckeditor5-utils').Locale } Locale
 */

import { ButtonView } from 'ckeditor5/src/ui';
import IconPickerFAIcon from './iconpickerfaicon';

export default class IconPickerItem extends ButtonView {
	/**
	 * Creates a new IconPickerItem.
	 * 
	 * @param {Locale} locale
	 *   The locale.
	 * @param {FontAwesomeVersion} faVersion
	 *   The version of Font Awesome being used.
	 * @param {string} iconName
	 *   The name of the icon this button is for.
	 * @param {IconDefinition} iconDefinition
	 *   The defintion of the icon this button is for.
	 */
	constructor(locale, faVersion, iconName, iconDefinition) {
		super(locale);
		
		const bind = this.bindTemplate;
	
		this.set({
			label:locale.t(iconDefinition.label),
			class: 'ckeditor5-icons__grid-item',
			isOn: false,
			withText: true
		});

		this._faIcon = new IconPickerFAIcon(locale, faVersion, iconName, iconDefinition);
		this._faIcon.extendTemplate({
			attributes: {
				class: [
					'ck-icon',
					'ck-button__icon',
					'ck-icon_inherit-color'
				]
			}
		});

		this.extendTemplate({
			attributes: {
				title: iconName
			},
			on: {
				mouseover: bind.to('mouseover'),
				focus: bind.to('focus')
			}
		});

		this.registerChild([this._faIcon]);
	}

	/**
	 * @inheritdoc
	 */
	render() {
		super.render();
		this.element.appendChild(this._faIcon.element);
	}
}
