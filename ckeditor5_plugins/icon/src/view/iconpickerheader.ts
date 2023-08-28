/**
 * @file contains the icon picker FormHeaderView.
 */

import type { Locale } from 'ckeditor5/src/utils';
import { Collection } from 'ckeditor5/src/utils';
import type { ListDropdownItemDefinition, DropdownView, FocusableView } from 'ckeditor5/src/ui';
import { addListToDropdown, createDropdown, FormHeaderView, Model } from 'ckeditor5/src/ui';
import type { CategoryDefinition, CategoryDefinitions, CategoryName, FontAwesomeStyle, IconName } from '../icontypes';

export default class IconPickerHeader extends FormHeaderView implements FocusableView {
	/**
	 * The name of the currently selected category.
	 * 
	 * @observable
	 */
	public declare categoryName: CategoryName | null;

	/**
	 * The definiton of the currently selected category.
	 * 
	 * @observable
	 */
	public declare categoryDefinition: CategoryDefinition | null;

	/**
	 * The category dropdown view.
	 */
	public readonly categoryDropdownView: DropdownView;

	/**
	 * Constructs a new IconPickerView.
	 * 
	 * @param locale
	 *   The locale.
	 * @param faCategories
	 *   The Font Awesome category definitions.
	 * @param faStyles
	 *   The enabled Font Awesome icon styles.
	 * @param recommendedIcons
	 *   The icons to display in the recommended category.
	 */
	public constructor(locale: Locale, faCategories: CategoryDefinitions, faStyles: FontAwesomeStyle[], recommendedIcons: IconName[] | null | undefined) {
		super(locale);

		this.categoryDropdownView = this._createCategoryDropdown(locale, faCategories, faStyles, recommendedIcons);
		this.categoryDropdownView.panelPosition = locale.uiLanguageDirection === 'rtl' ? 'se' : 'sw';

		this.label = locale.t('Icons');
		this.class = 'ckeditor5-icons__picker-header';

		this.children.add(this.categoryDropdownView);

		this.on<CategorySelectionEvent>('execute', (_eventInfo, categoryName, categoryDefinition) => {
			this.set('categoryName', categoryName);
			this.set('categoryDefinition', categoryDefinition);
		});
	}

	/**
	 * Focuses the `categoryDropdownView`.
	 */
	public focus() {
		this.categoryDropdownView.focus();
	}

	/**
	 * @param locale
	 *   The locale.
	 * @param faCategories
	 *   The object containing the category definitions.
	 * @param faStyles
	 *   The enabled Font Awesome icon styles.
	 * @param recommendedIcons
	 *   The icons to display in the recommended category.
	 * @returns
	 *   The category selection dropdown.
	 */
	private _createCategoryDropdown(locale: Locale, faCategories: CategoryDefinitions, faStyles: FontAwesomeStyle[], recommendedIcons: IconName[] | null | undefined): DropdownView {
		const dropdownView = createDropdown(locale), items = this._createCategoryDropdownItems(locale, faCategories, faStyles, recommendedIcons), defaultLabel = 'Select a category', t = locale.t;

		dropdownView.buttonView.set({
			label: t(defaultLabel),
			tooltip: t('Icon categories'),
			withText: true,
			class: 'ck-dropdown__button_label-width_auto'
		});
		dropdownView.buttonView.bind('label').to(this, 'categoryDefinition', value => t(value ? value.label : defaultLabel));
		dropdownView.on('execute', eventInfo => {
			const categoryName = (eventInfo.source as Model)['name'] as string;
			this.fire<CategorySelectionEvent>('execute', categoryName, faCategories[categoryName]!);
		});

		addListToDropdown(dropdownView, items);

		return dropdownView;
	}

	/**
	 * @returns
	 *   The category dropdown view items collection.
	 */
	private _createCategoryDropdownItems(locale: Locale, faCategories: CategoryDefinitions, faStyles: FontAwesomeStyle[], recommendedIcons: IconName[] | null | undefined): Collection<ListDropdownItemDefinition> {
		const pinnedCategoryNames: CategoryName[] = [];
		const pinnedCategoryDefinitons: CategoryDefinitions = {
			all: { icons: [], label: 'All' },
			brands: { icons: [], label: 'Brands' }
		};

		if (recommendedIcons) {
			pinnedCategoryNames.push('recommended');
			pinnedCategoryDefinitons['recommended'] = { icons: recommendedIcons, label: 'Recommended' };
		}
		pinnedCategoryNames.push('all');
		if (faStyles.includes('brands')) // Adds the "Brands" category if the brands style is accessible.
			pinnedCategoryNames.push('brands');

		const items = new Collection<ListDropdownItemDefinition>();

		const categoryEntries = Object.entries<CategoryDefinition>(faCategories);

		for (const categoryName of pinnedCategoryNames) {
			const categoryDefinition = pinnedCategoryDefinitons[categoryName]!, categoryNameEscaped = '_' + categoryName;
			this._addCategoryDropdownItem(locale, items, categoryNameEscaped, categoryDefinition);
			if (!faCategories[categoryNameEscaped])
				faCategories[categoryNameEscaped] = categoryDefinition;
		}
		items.add({ type: 'separator' });
		for (const [categoryName, categoryDefinition] of categoryEntries) {
			if ('_' !== categoryName[0])
				this._addCategoryDropdownItem(locale, items, categoryName, categoryDefinition);
		}

		return items;
	}

	/**
	 * Adds a new item to the category dropdown view items collection.
	 */
	private _addCategoryDropdownItem(locale: Locale, items: Collection<ListDropdownItemDefinition>, categoryName: CategoryName, categoryDefinition: CategoryDefinition) {
		const model = new Model({
			name: categoryName,
			label: locale.t(categoryDefinition.label),
			withText: true
		});
		model.bind('isOn').to(this, 'categoryName', value => value === categoryName);
		items.add({ type: 'button', model });
	}
}

/**
 * The event fired when a category is selected in the category dropdown.
 */
export type CategorySelectionEvent = {
	name: 'execute';
	args: [categoryName: CategoryName, categoryDefinition: CategoryDefinition];
};
