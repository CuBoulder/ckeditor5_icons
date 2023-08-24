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
		this.faVersion = faVersion;

		const t = locale.t, bind = this.bindTemplate;

		this.set('focusedIconDefinition', null);

		this.items = this.createCollection();

		this._faIcon = null;
		this.iconPreviewView = new View();
		this.iconPreviewView.setTemplate({
			tag: 'div',
			attributes: {
				class: ['ck', 'ckeditor5-icons__icon-preview']
			}
		});

		this.formView = new IconPickerForm(locale);
		this.formView.delegate('changeStyle', 'cancel').to(this);
		this.formView.delegate('submit').to(this, 'execute');
		this.formView.bind('iconName', 'iconStyle', 'iconDefinition').to(this);

		this.setTemplate({
			tag: 'div',
			attributes: {
				class: ['ck', 'ckeditor5-icons__picker-footer']
			},
			children: [
				{
					tag: 'div',
					attributes: {
						class: ['ck', 'ckeditor5-icons__picker-preview', bind.to('iconName', value => value ? '' : 'ck-hidden')]
					},
					children: [
						this.iconPreviewView,
						{
							tag: 'div',
							attributes: {
								class: ['ck', 'ckeditor5-icons__icon-info']
							},
							children: [
								{
									tag: 'span',
									attributes: {
										class: ['ck', 'ckeditor5-icons__icon-label']
									},
									children: [{ text: bind.to('iconDefinition', value => value ? t(value.label) : '') }]
								},
								{
									tag: 'span',
									attributes: {
										class: ['ck', 'ckeditor5-icons__icon-name']
									},
									children: [{ text: bind.to('iconName') }]
								}
							]
						}
					]
				},
				{
					tag: 'div',
					attributes: {
						class: ['ck', 'ckeditor5__picker-info', bind.to('iconName', value => value ? 'ck-hidden' : '')]
					},
					children: [
						{
							tag: 'div',
							attributes: {
								class: ['ck', 'ckeditor5-icons__focused-label']
							},
							children: [{ text: bind.to('focusedIconDefinition', value => value ? t(value.label) : t('Select an icon')) }]
						},
						{
							tag: 'div',
							attributes: {
								class: ['ck', 'ckeditor5-icons__library-attr']
							},
							children: [{ text: faVersion === '5' ? 'Font Awesome 5' : 'Font Awesome 6' }]
						}
					]
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
		if (this.iconDefinition)
			this.formView.refresh(faStyles);

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
		if (this.iconName)
			this.formView.focus();
	}
}
