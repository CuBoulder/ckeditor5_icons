/**
 * @file contains the icon picker search form.
 * 
 * @typedef { import('@ckeditor/ckeditor5-utils').Locale } Locale
 */

import { createLabeledInputText, LabeledFieldView, View } from 'ckeditor5/src/ui';

export default class IconPickerSearch extends View {
	/**
	 * Creates a new IconPickerSearch.
	 * 
	 * @param {Locale} locale 
	 *   The locale.
	 */
	constructor(locale) {
		super(locale);

		const bind = this.bindTemplate, delayms = 500, t = locale.t;
		let delayTimer;

		this.searchFieldView = new LabeledFieldView(locale, createLabeledInputText);
		this.searchFieldView.set({
			label: t('Search All')
		});
		this.searchFieldView.fieldView.on('input', eventInfo => {
			const value = eventInfo.source.element.value;
			if (delayTimer)
				clearTimeout(delayTimer);
			delayTimer = setTimeout(() => this.fire('search', value), delayms);
		});

		this.setTemplate({
			tag: 'form',
			attributes: {
				class: ['ck', 'ckeditor5-icons__picker-search']
			},
			children: [this.searchFieldView]
		});
	}
}
