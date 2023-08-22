/**
 * @file contains the icon picker icon for FontAwesome icons.
 * 
 * @typedef { import('../iconconfig').FontAwesomeVersion } FontAwesomeVersion
 * @typedef { import('@types/ckeditor__ckeditor5-utils').Locale } Locale
 */

import { View } from 'ckeditor5/src/ui';
import { getValidIconStyle } from '../iconutils';
import IconPickerFAIcon from './iconpickerfaicon';
import IconPickerForm from './iconpickerform';

export default class IconPickerFooter extends View {
	/**
	 * Creates a new IconPickerFooter.
	 * 
	 * @param {Locale} locale
	 *   The locale.
	 */
	constructor(locale) {
		super(locale);

		const t = locale.t, bind = this.bindTemplate;

		this.set('iconLabel', 'Select an icon');

		this.items = this.createCollection();

		this._faIcon = null;
		this.iconPreviewView = new View();
		this.iconPreviewView.setTemplate({
			tag: 'span',
			attributes: {
				class: ['ckeditor5-icons__picker-preview']
			}
		});

		this.iconLabelView = new View();
		this.iconLabelView.setTemplate({
			tag: 'span',
			attributes: {
				class: ['ckeditor5-icons__picker-label']
			},
			children: [{ text: bind.to('iconLabel', value => t(value)) }]
		});

		this.formView = new IconPickerForm(locale);
		this.formView.bind('iconName').to(this);
		this.listenTo(this.formView, 'submit', () => this.fire('execute'));
		this.formView.delegate('cancel').to(this);

		this.setTemplate({
			tag: 'div',
			attributes: {
				class: ['ck', 'ck-character-info', 'ckeditor5-icons__picker-footer']
			},
			children: [this.iconPreviewView, this.iconLabelView, this.formView]
		});
	}

	/**
	 * Refreshes the icon picker footer when an icon in the grid is selected.
	 * 
	 * @param {FontAwesomeVersion} faVersion
	 *   The version of Font Awesome being used.
	 */
	refresh(faVersion) {
		if (this.iconDefinition) {
			this.set('iconLabel', this.iconDefinition.label);
		} else this.set('iconLabel', 'Select an icon');

		const iconPreviewView = this.iconPreviewView;
		let faIcon = null;

		if (this._faIcon) {
			iconPreviewView.deregisterChild(this._faIcon);
			iconPreviewView.element.innerText = '';
		}

		if (this.iconName && this.iconDefinition) {
			faIcon = new IconPickerFAIcon(this.locale, faVersion, this.iconName, this.iconDefinition, this.iconStyle);
			iconPreviewView.registerChild(faIcon);
			iconPreviewView.element.appendChild(faIcon.element);
		}

		this._faIcon = faIcon;
	}

	/**
	 * Focuses the form view.
	 */
	focus() {
		this.formView.focus();
	}
}
