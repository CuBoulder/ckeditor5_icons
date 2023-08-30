/**
 * @file contains the icon picker icon for FontAwesome icons.
 */

import type { Locale } from 'ckeditor5/src/utils';
import { View } from 'ckeditor5/src/ui';
import IconPickerFAIcon from './iconpickerfaicon';
import IconPickerForm from './iconpickerform';
import IconPickerSearch from './iconpickersearch';
import type { FontAwesomeStyle, FontAwesomeVersion, IconDefinition, IconName } from '../icontypes';

export default class IconPickerFooter extends View {
	/**
	 * The Font Awesome version.
	 */
	private readonly faVersion: FontAwesomeVersion;

	/**
	 * The name of the currently selected icon.
	 * 
	 * @observable
	 */
	public declare iconName?: IconName | null;

	/**
	 * The selected style of the currently selected icon.
	 * 
	 * @observable
	 */
	public declare iconStyle?: FontAwesomeStyle;

	/**
	 * The definition of the currently selected icon.
	 * 
	 * @observable
	 */
	public declare iconDefinition?: IconDefinition | null;

	/**
	 * The search form view.
	 */
	public readonly searchView: IconPickerSearch;

	/**
	 * The selected icon preview view.
	 */
	public readonly iconPreviewView: View;

	/**
	 * The selected icon insert form view.
	 */
	public readonly formView: IconPickerForm;

	/**
	 * The FontAwesome icon view (if an icon is selected).
	 */
	private faIcon: IconPickerFAIcon | null;

	/**
	 * Constructs a new IconPickerFooter.
	 * 
	 * @param locale
	 *   The locale.
	 * @param faVersion
	 *   The version of Font Awesome being used.
	 */
	public constructor(locale: Locale, faVersion: FontAwesomeVersion) {
		super(locale);
		this.faVersion = faVersion;

		const t = locale.t, bind = this.bindTemplate;

		this.searchView = new IconPickerSearch(locale);
		this.searchView.delegate('search').to(this);

		this.iconPreviewView = new View();
		this.iconPreviewView.setTemplate({
			tag: 'div',
			attributes: {
				class: ['ck', 'ckeditor5-icons__icon-preview']
			}
		});
		this.faIcon = null;

		this.formView = new IconPickerForm(locale);
		this.formView.delegate('changeStyle', 'cancel').to(this);
		this.formView.delegate('submit').to(this, 'execute');
		this.formView.bind('iconStyle').to(this);

		this.setTemplate({
			tag: 'div',
			attributes: {
				class: ['ck', 'ckeditor5-icons__picker-footer']
			},
			children: [
				{
					tag: 'div',
					attributes: {
						class: ['ck', 'ckeditor5-icons__footer-flex', bind.to('iconName', value => value ? '' : 'ck-hidden')]
					},
					children: [
						{
							tag: 'div',
							attributes: {
								class: ['ck', 'ckeditor5-icons__picker-preview']
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
						this.formView
					]
				},
				{
					tag: 'div',
					attributes: {
						class: ['ck', bind.to('iconName', value => value ? 'ck-hidden' : '')]
					},
					children: [
						this.searchView
					]
				}
			]
		});
	}

	/**
	 * Refreshes the icon picker footer when an icon in the grid is selected.
	 */
	public refresh() {
		if (this.iconDefinition)
			this.formView.refresh(this.iconName, this.iconDefinition);

		const iconPreviewView = this.iconPreviewView;
		let faIcon: IconPickerFAIcon | null = null;

		if (this.faIcon) {
			iconPreviewView.deregisterChild(this.faIcon);
			iconPreviewView.element!.innerText = '';
		}

		if (this.iconName && this.iconDefinition) {
			faIcon = new IconPickerFAIcon(this.locale!, this.faVersion, this.iconName, this.iconDefinition, this.iconStyle);
			iconPreviewView.registerChild(faIcon);
			iconPreviewView.element!.appendChild(faIcon.element!);
		}

		this.faIcon = faIcon;
	}
}
