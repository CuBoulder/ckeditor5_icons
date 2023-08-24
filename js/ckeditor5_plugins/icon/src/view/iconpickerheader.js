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
	 * @param {string[]} faStyles
	 *   The enabled Font Awesome icon styles.
	 * @param {string[]?} recommendedIcons
	 *   The icons to display in the recommended category.
	 */
	constructor(locale, faCategories, faStyles, recommendedIcons) {
		super(locale);

		this.categoryDropdownView = this._createCategoryDropdown(locale, faCategories, faStyles, recommendedIcons);
		this.categoryDropdownView.panelPosition = locale.uiLanguageDirection === 'rtl' ? 'se' : 'sw';

		this.label = locale.t('Icons');
		this.class = 'ckeditor5-icons__picker-header';

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
	 * @param {Object<string, CategoryDefinition>} faCategories
	 *   The object containing the category definitions.
	 * @param {string[]} faStyles
	 *   The enabled Font Awesome icon styles.
	 * @param {string[]?} recommendedIcons
	 *   The icons to display in the recommended category.
	 * @returns {DropdownView}
	 *   The category selection dropdown.
	 */
	_createCategoryDropdown(locale, faCategories, faStyles, recommendedIcons) {
		const dropdownView = createDropdown(locale), items = createCategoryDropdownItems(locale, dropdownView, faCategories, faStyles, recommendedIcons), defaultLabel = 'Select a category', t = locale.t;

		dropdownView.buttonView.set({
			label: t(defaultLabel),
			tooltip: t('Icon categories'),
			withText: true,
			class: 'ck-dropdown__button_label-width_auto'
		});
		dropdownView.buttonView.bind('label').to(this, 'categoryDefinition', value => t(value ? value.label : defaultLabel));
		dropdownView.bind('value').to(this, 'categoryName');
		dropdownView.on('execute', eventInfo => {
			const categoryName = eventInfo.source.name;
			dropdownView.set('value', categoryName);
			this.fire('execute', categoryName, faCategories[categoryName]);
		});

		addListToDropdown(dropdownView, items);

		return dropdownView;
	}
}

/**
 * @param {Locale} locale
 * @param {DropdownView} dropdownView 
 * @param {Object<string, CategoryDefinition>} faCategories
 * @param {string[]} faStyles
 * @param {string[]?} recommendedIcons
 * @returns {Collection<ListDropdownItemDefinition>}
 *   The category dropdown view items collection.
 */
function createCategoryDropdownItems(locale, dropdownView, faCategories, faStyles, recommendedIcons) {
	const pinnedCategoryNames = [];
	/** @type {CategoryDefinition[]} */
	const pinnedCategoryDefinitons = {
		'all': { icons: [], label: 'All' },
		'brands': { icons: [], label: 'Brands' }
	};

	if (recommendedIcons) {
		pinnedCategoryNames.push('recommended');
		pinnedCategoryDefinitons['recommended'] = { icons: recommendedIcons, label: 'Recommended' };
	}
	pinnedCategoryNames.push('all');
	if(faStyles.includes('brands')) // Adds the "Brands" category if the brands style is accessible.
		pinnedCategoryNames.push('brands');

	/** @type {Collection<ListDropdownItemDefinition>} */
	const items = new Collection();

	const categoryEntries = Object.entries(faCategories);

	for (const categoryName of pinnedCategoryNames) {
		const categoryDefinition = pinnedCategoryDefinitons[categoryName], categoryNameEscaped = '_' + categoryName;
		addCategoryDropdownItem(locale, dropdownView, items, categoryNameEscaped, pinnedCategoryDefinitons[categoryName]);
		if (!faCategories[categoryNameEscaped])
			faCategories[categoryNameEscaped] = categoryDefinition;
	}
	items.add({ type: 'separator' });
	for (const [categoryName, categoryDefinition] of categoryEntries) {
		if ('_' !== categoryName[0])
			addCategoryDropdownItem(locale, dropdownView, items, categoryName, categoryDefinition);
	}

	return items;
}

/**
 * Adds a new item to the category dropdown view items collection.
 * 
 * @param {Locale} locale
 * @param {DropdownView} dropdownView 
 * @param {Collection<ListDropdownItemDefinition>} items 
 * @param {string} categoryName 
 * @param {CategoryDefinition} categoryDefinition 
 */
function addCategoryDropdownItem(locale, dropdownView, items, categoryName, categoryDefinition) {
	const model = new Model({
		name: categoryName,
		label: locale.t(categoryDefinition.label),
		withText: true
	});
	model.bind('isOn').to(dropdownView, 'value', value => value === categoryName);
	items.add({ type: 'button', model });
}
