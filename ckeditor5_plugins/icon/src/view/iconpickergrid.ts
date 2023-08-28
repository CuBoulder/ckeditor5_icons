/**
 * @file contains the icon picker grid view.
 */

import type { Locale } from 'ckeditor5/src/utils';
import { FocusTracker, KeystrokeHandler } from 'ckeditor5/src/utils';
import type { FocusableView, ViewCollection } from 'ckeditor5/src/ui';
import { View } from 'ckeditor5/src/ui';
import addKeyboardHandlingForGrid from '@ckeditor/ckeditor5-ui/src/bindings/addkeyboardhandlingforgrid';
import IconPickerItem from './iconpickeritem';
import { ButtonView } from 'ckeditor5/src/ui';
import { icons } from 'ckeditor5/src/core';
import type { FontAwesomeStyle, FontAwesomeVersion, CategoryDefinition, CategoryName, IconDefinition, IconDefinitions, IconName } from '../icontypes';

export default class IconPickerGrid extends View implements FocusableView {
	/**
	 * The Font Awesome version.
	 */
	private readonly faVersion: FontAwesomeVersion;

	/**
	 * The name of the currently selected icon.
	 * 
	 * @observable
	 */
	public iconName?: IconName | null;

	/**
	 * The selected style of the currently selected icon.
	 * 
	 * @observable
	 */
	public iconStyle?: FontAwesomeStyle | null;

	/**
	 * The definition of the currently selected icon.
	 * 
	 * @observable
	 */
	public iconDefinition?: IconDefinition | null;

	/**
	 * The view containing the grid's sections.
	 */
	public readonly itemsView: View;

	/**
	 * The "Show More" button view.
	 */
	public readonly expandButtonView: ButtonView;

	/**
	 * The items for which to track focus (arrow keys).
	 */
	private readonly items: ViewCollection<IconPickerItem>;

	/**
	 * The sections (larger categories may contain multiple sections).
	 */
	private readonly sections: ViewCollection<View>;

	/**
	 * The focus tracker.
	 */
	private readonly focusTracker: FocusTracker;

	/**
	 * The keystroke handler.
	 */
	private readonly keystrokes: KeystrokeHandler;

	/**
	 * Constructs a new IconPickerGrid.
	 * 
	 * @param locale
	 *   The locale.
	 * @param faVersion
	 *   The version of Font Awesome being used.
	 */
	public constructor(locale: Locale, faVersion: FontAwesomeVersion) {
		super(locale);
		this.faVersion = faVersion;

		const t = locale.t;

		this.items = this.createCollection();
		this.sections = this.createCollection();

		this.itemsView = new View();
		this.itemsView.setTemplate({
			tag: 'div',
			attributes: {
				class: ['ck', 'ckeditor5-icons__grid-section']
			}
		});

		this.expandButtonView = new ButtonView(locale);
		this.expandButtonView.set({
			icon: icons.plus,
			label: t('Show More'),
			withText: true,
			isVisible: false,
			class: 'ckeditor5-icons__grid-expand'
		});

		this.setTemplate({
			tag: 'div',
			attributes: {
				class: ['ck', 'ckeditor5-icons__grid']
			},
			children: [
				this.itemsView,
				{
					tag: 'div',
					attributes: {
						class: ['ck', 'ckeditor5-icons__grid-options', this.expandButtonView.bindTemplate.to('isVisible', value => value ? '' : 'ck-hidden')]
					},
					children: [this.expandButtonView]
				}
			]
		});

		this.focusTracker = new FocusTracker();
		this.keystrokes = new KeystrokeHandler();

		// Enables wrap-around arrow key navigation of the grid. Requires `@ckeditor/ckeditor5-ui` package.
		// See `ckeditor5/packages/ckeditor5-special-characters/src/ui/charactergridview.ts`.
		addKeyboardHandlingForGrid({
			keystrokeHandler: this.keystrokes,
			focusTracker: this.focusTracker,
			gridItems: this.items,
			numberOfColumns: () => global.window
				.getComputedStyle(this.itemsView.element!.firstChild as Element) // Responsive .ck-character-grid__tiles
				.getPropertyValue('grid-template-columns')
				.split(' ')
				.length,
			uiLanguageDirection: locale.uiLanguageDirection
		});
	}

	/**
	 * @returns
	 *   An IconPickerItem created based on the provded icon.
	 */
	private _createItem(iconName: IconName, iconDefinition: IconDefinition): IconPickerItem {
		const item = new IconPickerItem(this.locale!, this.faVersion, iconName, iconDefinition);

		// Attaches events to the grid item.
		item.on('mouseover', () => this.fire<IconHoverEvent>('itemHover', iconName, iconDefinition));
		item.on('focus', () => this.fire<IconFocusEvent>('itemFocus', iconName, iconDefinition));
		item.on('execute', () => this.fire<IconSelectionEvent>('execute', iconName, iconDefinition));
		item.bind('isOn').to(this, 'iconName', value => iconName === value);

		return item;
	}

	/**
	 * Refreshes this icon picker grid based on a category selection.
	 */
	public refresh(categoryName: CategoryName, categoryDefinition: CategoryDefinition, iconDefinitions: IconDefinitions, searchQuery?: string) {
		this.items.clear();
		this.itemsView.deregisterChild(this.sections);
		this.itemsView.element!.innerText = '';
		this.sections.clear();

		let iconNames: IconName[];
		if (categoryName === '_all')
			iconNames = Object.keys(iconDefinitions);
		else if (categoryName === '_brands')
			iconNames = Object.keys(iconDefinitions).filter(value => iconDefinitions[value]!.styles.includes('brands'));
		else iconNames = categoryDefinition.icons;

		if (searchQuery)
			iconNames = searchResults(iconNames, iconDefinitions, searchQuery);

		this._populateGrid(iconNames, iconDefinitions);
	}

	/**
	 * @inheritdoc
	 */
	public override render() {
		super.render();

		for (const item of this.items)
			this.focusTracker.add(item.element!);

		this.items.on('change', (_eventInfo, { added, removed }) => {
			if (added.length > 0) {
				for (const item of added)
					this.focusTracker.add(item.element);
			}
			if (removed.length > 0) {
				for (const item of removed)
					this.focusTracker.remove(item.element);
			}
		});

		this.keystrokes.listenTo(this.element!);
	}

	/**
	 * @inheritdoc
	 */
	public override destroy() {
		super.destroy();

		this.focusTracker.destroy();
		this.keystrokes.destroy();
	}

	/**
	 * Focuses a focusable in `items`.
	 */
	public focus() {
		if (this.iconName) {
			const item = this.items.find(item => item.isOn);
			if (item) {
				item.focus();
				return;
			}
		}
		const first = this.items.first;
		if (first)
			first.focus();
	}

	/**
	 * Populates the icon grid.
	 */
	private _populateGrid(iconNames: IconName[], iconDefinitions: IconDefinitions, startAt = 0) {
		const buttonView = this.expandButtonView;
		this.stopListening(buttonView, 'execute');

		const max = 200, length = iconNames.length - startAt, section = new View(), sectionItems: ViewCollection<IconPickerItem> = this.createCollection();

		for (let index = 0; index < Math.min(max, length); index++) {
			const iconName = iconNames[startAt + index]!, iconDefinition = iconDefinitions[iconName];
			if (iconDefinition) {
				const item = this._createItem(iconName, iconDefinitions[iconName]!);
				sectionItems.add(item);
				this.items.add(item);
			}
		}

		section.setTemplate({
			tag: 'div',
			attributes: {
				class: ['ck', 'ckeditor5-icons__grid-items']
			},
			children: sectionItems
		});

		this.sections.add(section);
		this.itemsView.registerChild(section);
		this.itemsView.element!.appendChild(section.element!);

		if (length > max) {
			buttonView.set('isVisible', true);
			this.listenTo(buttonView, 'execute', () => {
				this.items.last!.focus();
				this._populateGrid(iconNames, iconDefinitions, startAt + max);
			});
			this.fire<GridSectionLoadEvent>('gridSectionLoad', true);
		} else {
			buttonView.set('isVisible', false);
			this.fire<GridSectionLoadEvent>('gridSectionLoad', false);
		}
	}
}

/**
 * @returns
 *   The filtered search results.
 */
function searchResults(iconNames: IconName[], iconDefinitions: IconDefinitions, searchQuery: string): IconName[] {
	searchQuery = searchQuery.toLowerCase();

	if (searchQuery.length > 3 && searchQuery.substring(0, 3) === 'fa-') // Strips `fa-` prefix.
		searchQuery = searchQuery.substring(3);

	const orderedResults: IconName[] = [], resultSet = new Set<IconName>();

	if (iconNames.includes(searchQuery)) { // First pass: checks exact match of icon name.
		orderedResults.push(searchQuery);
		resultSet.add(searchQuery);
	}

	for (const iconName of iconNames) { // Second pass: checks exact match of keywords.
		if (iconName !== searchQuery && iconDefinitions[iconName]!.search.terms.includes(searchQuery)) {
			orderedResults.push(iconName);
			resultSet.add(iconName);
		}
	}

	for (const iconName of iconNames) { // Third pass: checks icon name starts with.
		if (!resultSet.has(iconName) && iconName.indexOf(searchQuery) === 0) {
			orderedResults.push(iconName);
			resultSet.add(iconName);
		}
	}

	return orderedResults;
}

/**
 * The event fired when an icon is selected.
 */
export type IconSelectionEvent = {
	name: 'execute';
	args: [iconName: IconName, IconDefinition: IconDefinition];
};

/**
 * The event fired when an icon is hovered over.
 */
export type IconHoverEvent = {
	name: 'itemHover';
	args: [iconName: IconName, IconDefinition: IconDefinition];
};

/**
 * The event fired when an icon is focused.
 */
export type IconFocusEvent = {
	name: 'itemFocus';
	args: [iconName: IconName, IconDefinition: IconDefinition];
};

/**
 * The event fired when the grid has loaded a new section of icons.
 */
export type GridSectionLoadEvent = {
	name: 'gridSectionLoad';
	args: [expandButtonVisible: boolean];
};
