/**
 * @file contains the icon picker search form.
 */

import type { Locale } from 'ckeditor5/src/utils';
import { createLabeledInputText, LabeledFieldView, View } from 'ckeditor5/src/ui';

export default class IconPickerSearch extends View {
	/**
	 * The labeled search field view.
	 */
	public readonly searchFieldView: LabeledFieldView;

	/**
	 * Constructs a new IconPickerSearch.
	 * 
	 * @param locale 
	 *   The locale.
	 */
	public constructor(locale: Locale) {
		super(locale);

		const delayms = 500, t = locale.t;
		let delayTimer: any;

		this.searchFieldView = new LabeledFieldView(locale, createLabeledInputText);
		this.searchFieldView.label = t('Search all icons');
		this.searchFieldView.fieldView.on('input', eventInfo => {
			const value = ((eventInfo.source as View).element as HTMLInputElement).value;
			if (delayTimer)
				clearTimeout(delayTimer);
			delayTimer = setTimeout(() => this.fire<SearchEvent>('search', value), delayms);
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

/**
 * The event fired when a search change is performed.
 */
export type SearchEvent = {
	name: 'search';
	args: [queryString: string];
};
