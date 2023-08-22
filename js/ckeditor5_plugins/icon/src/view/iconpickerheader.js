/**
 * @file contains the icon picker FormHeaderView.
 * 
 * @typedef { import('../iconconfig').CategoryDefinition } CategoryDefinition
 * @typedef { import('@ckeditor/ckeditor5-utils').Locale } Locale
 * @typedef { import('@ckeditor/ckeditor5-ui/src/dropdown/dropdownview').default } DropdownView
 * @typedef { import('@ckeditor/ckeditor5-ui/src/dropdown/utils').ListDropdownItemDefinition } ListDropdownItemDefinition
 */

import { Collection } from 'ckeditor5/src/utils';
import { addListToDropdown, createDropdown, FormHeaderView, Model } from 'ckeditor5/src/ui';

export default class IconPickerHeader extends FormHeaderView {
	/**
	 * Creates a new IconPickerView.
	 * 
	 * @param {Locale} locale
	 *   The locale.
	 * @param {Object<string, CategoryDefinition>} faCategories
	 *   The Font Awesome category definitions.
	 */
	constructor(locale, faCategories) {
		super(locale);

		this.categoryDropdownView = this._createCategoryDropdown(locale, faCategories);
		this.categoryDropdownView.panelPosition = locale.uiLanguageDirection === 'rtl' ? 'se' : 'sw';

		this.label = locale.t('Icons');
		this.class = ['ckeditor5-icons__picker-header'];

		this.children.add(this.categoryDropdownView);
	}

	/**
	 * Focuses the `categoryDropdownView`.
	 */
	focus() {
		this.categoryDropdownView.focus();
	}

	/**
	 * @param {Locale} locale
	 *   The locale.
	 * @param {Object<string, CategoryDefinition>} categories
	 *   The object containing the category definitions.
	 * @returns {DropdownView}
	 *   The category selection dropdown.
	 */
	_createCategoryDropdown(locale, faCategories) {
		const dropdownView = createDropdown(locale), items = createCategoryDropdownItems(locale, dropdownView, faCategories), defaultLabel = 'Select a category', t = locale.t;

		dropdownView.buttonView.set({
			label: t(defaultLabel),
			tooltip: t('Icon categories'),
			withText: true,
			class: ['ck-dropdown__button_label-width_auto']
		});
		dropdownView.buttonView.bind('label').to(this, 'categoryDefinition', value => t(value ? value.label : defaultLabel));
		dropdownView.on('execute', eventInfo => { 
			const categoryName = eventInfo.source.name;
			dropdownView.set('value', eventInfo.source.name);
			this.fire('execute', categoryName, faCategories[categoryName]);
		});

		addListToDropdown(dropdownView, items);

		return dropdownView;
	}
}

/**
 * @param {Locale} locale
 *   The locale.
 * @param {DropdownView} dropdownView 
 *   The dropdown view.
 * @param {Object<string, CategoryDefinition>} faCategories
 *   The Font Awesome category definitions.
 * @returns {Collection<ListDropdownItemDefinition>}
 *   The opts for the dropdown view.
 */
function createCategoryDropdownItems(locale, dropdownView, faCategories) {
	/** @type {Collection<ListDropdownItemDefinition>} */
	const items = new Collection();

	for (const [name, definition] of Object.entries(faCategories)) {
		const model = new Model({
			name,
			label: locale.t(definition.label),
			withText: true
		});
		model.bind('isOn').to(dropdownView, 'value', value => value === name);
		items.add({ type: 'button', model });
	}

	return items;
}
