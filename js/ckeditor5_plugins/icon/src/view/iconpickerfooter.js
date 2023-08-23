/**
 * @file contains the icon picker icon for FontAwesome icons.
 * 
 * @typedef { import('../iconconfig').FontAwesomeVersion } FontAwesomeVersion
 * @typedef { import('@types/ckeditor__ckeditor5-utils').Locale } Locale
 */

import { View } from 'ckeditor5/src/ui';
import IconPickerFAIcon from './iconpickerfaicon';
import IconPickerForm from './iconpickerform';

export default class IconPickerFooter extends View {
	/**
	 * Creates a new IconPickerFooter.
	 * 
	 * @param {Locale} locale
	 *   The locale.
	 * @param {FontAwesomeVersion} faVersion
	 *   The version of Font Awesome being used.
	 */
	constructor(locale, faVersion) {
		super(locale);

		const t = locale.t, bind = this.bindTemplate;

		this.faVersion = faVersion;
		this.set('iconLabel', 'Select an icon');

		this.items = this.createCollection();

		this._faIcon = null;
		this.iconPreviewView = new View();
		this.iconPreviewView.setTemplate({
			tag: 'span',
			attributes: {
				class: ['ck', 'ckeditor5-icons__icon-preview']
			}
		});

		this.iconLabelView = new View();
		this.iconLabelView.setTemplate({
			tag: 'span',
			attributes: {
				class: ['ck', 'ckeditor5-icons__icon-label', bind.to('iconName', value => value ? '' : 'ck-hidden')]
			},
			children: [{ text: bind.to('iconLabel', value => t(value)) }]
		});

		this.formView = new IconPickerForm(locale);
		this.formView.extendTemplate({
			attributes: {
				class: ['ck', bind.to('iconName', value => value ? '' : 'ck-hidden')]
			}
		});
		this.formView.bind('iconName', 'iconStyle', 'iconDefinition').to(this);
		this.formView.delegate('changeStyle').to(this);
		this.formView.delegate('cancel').to(this);
		this.listenTo(this.formView, 'submit', () => this.fire('execute'));

		this.setTemplate({
			tag: 'div',
			attributes: {
				class: ['ck', 'ckeditor5-icons__picker-footer']
			},
			children: [
				{
					tag: 'div',
					attributes: {
						class: ['ck', 'ckeditor5-icons__picker-preview']
					},
					children: [this.iconPreviewView, this.iconLabelView]
				},
				{
					tag: 'div',
					attributes: {
						class: ['ck', 'ckeditor5-icons__library-info', bind.to('iconName', value => value ? 'ck-hidden' : '')]
					},
					children: [{ text: faVersion === '5' ? 'Font Awesome 5' : 'Font Awesome 6' }]
				},
				this.formView
			]
		});
	}

	/**
	 * Refreshes the icon picker footer when an icon in the grid is selected.
	 * 
	 * @param {string[]} faStyles
	 *   The enabled Font Awesome icon styles.
	 */
	refresh(faStyles) {
		if (this.iconDefinition) {
			this.set('iconLabel', this.iconDefinition.label);
			this.formView.refresh(faStyles);
		} else this.set('iconLabel', 'Select an icon');

		const iconPreviewView = this.iconPreviewView;
		let faIcon = null;

		if (this._faIcon) {
			iconPreviewView.deregisterChild(this._faIcon);
			iconPreviewView.element.innerText = '';
		}

		if (this.iconName && this.iconDefinition) {
			faIcon = new IconPickerFAIcon(this.locale, this.faVersion, this.iconName, this.iconDefinition, this.iconStyle);
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
