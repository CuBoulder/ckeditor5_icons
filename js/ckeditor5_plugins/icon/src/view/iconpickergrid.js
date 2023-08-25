/**
 * @file contains the icon picker grid view.
 * 
 * @typedef { import('../iconconfig').FontAwesomeVersion } FontAwesomeVersion
 * @typedef { import('../iconconfig').CategoryDefinition } CategoryDefinition
 * @typedef { import('../iconconfig').IconDefinition } IconDefinition
 * @typedef { import('@ckeditor/ckeditor5-utils').Locale } Locale
 */

import { Collection, FocusTracker, KeystrokeHandler } from "ckeditor5/src/utils";
import { View } from 'ckeditor5/src/ui';
import addKeyboardHandlingForGrid from '@ckeditor/ckeditor5-ui/src/bindings/addkeyboardhandlingforgrid';
import IconPickerItem from './iconpickeritem';
import { ButtonView } from "ckeditor5/src/ui";
import { icons } from "ckeditor5/src/core";

export default class IconPickerGrid extends View {
	/**
	 * Creates a new IconPickerGrid.
	 * 
	 * @param {Locale} locale
	 *   The locale.
	 * @param {FontAwesomeVersion} faVersion
	 *   The version of Font Awesome being used.
	 */
	constructor(locale, faVersion) {
		super(locale);
		this.faVersion = faVersion;

		const t = this.locale.t;

		this.items = this.createCollection();
		this.sections = new Collection();

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
			label: t('Show more'),
			tooltip: t('Show more icons'),
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
				.getComputedStyle(this.itemsView.element.firstChild) // Responsive .ck-character-grid__tiles
				.getPropertyValue('grid-template-columns')
				.split(' ')
				.length,
			uiLanguageDirection: locale.uiLanguageDirection
		});
	}

	/**
	 * @param {string} iconName
	 * @param {IconDefinition} iconDefinition
	 * @returns {IconPickerItem}
	 *   An IconPickerItem created based on the provded icon.
	 */
	_createItem(iconName, iconDefinition) {
		const item = new IconPickerItem(this.locale, this.faVersion, iconName, iconDefinition), t = this.locale.t;

		item.on('mouseover', () => this.fire('itemHover', iconName, iconDefinition));
		item.on('focus', () => this.fire('itemFocus', iconName, iconDefinition));
		item.on('execute', () => this.fire('execute', iconName, iconDefinition));
		item.bind('isOn').to(this, 'iconName', value => iconName === value);

		return item;
	}

	/**
	 * Refreshes this icon picker grid based on a category selection.
	 * 
	 * @param {string} categoryName
	 * @param {CategoryDefinition} categoryDefinition
	 * @param {Object<string, IconDefinition>} iconDefinitions
	 * @param {string?} searchQuery
	 */
	refresh(categoryName, categoryDefinition, iconDefinitions, searchQuery) {
		this.items.clear();
		this.itemsView.deregisterChild(this.sections);
		this.itemsView.element.innerText = '';
		this.sections.clear();

		/** @type {string[]} */
		let iconNames;
		if (categoryName === '_all')
			iconNames = Object.keys(iconDefinitions);
		else if (categoryName === '_brands')
			iconNames = Object.keys(iconDefinitions).filter(value => iconDefinitions[value].styles.includes('brands'));
		else iconNames = categoryDefinition.icons;

		if (searchQuery)
			iconNames = searchResults(iconNames, iconDefinitions, searchQuery);

		this._populateGrid(iconNames, iconDefinitions);
	}

	/**
	 * @inheritdoc
	 */
	render() {
		super.render();

		for (const item of this.items)
			this.focusTracker.add(item.element);

		this.items.on('change', (eventInfo, { added, removed }) => {
			if (added.length > 0) {
				for (const item of added)
					this.focusTracker.add(item.element);
			}
			if (removed.length > 0) {
				for (const item of removed)
					this.focusTracker.remove(item.element);
			}
		});

		this.keystrokes.listenTo(this.element);
	}

	/**
	 * @inheritdoc
	 */
	destroy() {
		super.destroy();

		this.focusTracker.destroy();
		this.keystrokes.destroy();
	}

	/**
	 * Focuses the first focusable in `items`.
	 */
	focus() {
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
	 * 
	 * @param {string[]} iconNames
	 * @param {Object<string, IconDefinition>} iconDefinitions
	 * @param {number} startAt
	 */
	_populateGrid(iconNames, iconDefinitions, startAt = 0) {
		const max = 200, length = iconNames.length - startAt, section = new View(), sectionItems = new Collection();

		for (let index = 0; index < Math.min(max, length); index++) {
			const iconName = iconNames[startAt + index], iconDefinition = iconDefinitions[iconName];
			if (iconDefinition) {
				const item = this._createItem(iconName, iconDefinitions[iconName])
				sectionItems.add(item);
				this.items.add(item);
			}
		}

		const buttonView = this.expandButtonView;
		this.stopListening(buttonView, 'execute');
		if (length > max) {
			buttonView.set('isVisible', true);
			this.listenTo(buttonView, 'execute', () => {
				this.items.last.focus();
				this._populateGrid(iconNames, iconDefinitions, startAt + max);
			});
			this.fire('expandPossible', true);
		} else {
			this.fire('expandPossible', false);
			buttonView.set('isVisible', false);
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
		this.itemsView.element.appendChild(section.element);
	}
}


/**
 * @param {string[]} iconNames
 * @param {Object<string, IconDefinition>} iconDefinitions
 * @param {string} searchQuery
 * @returns {string[]}
 *   The filtered search results.
 */
function searchResults(iconNames, iconDefinitions, searchQuery) {
	if (searchQuery.length > 3 && searchQuery.substr(0, 3) === 'fa-') // Strips `fa-` prefix.
		searchQuery = searchQuery.substr(3);

	const orderedResults = [], resultSet = new Set();

	if (iconNames.includes(searchQuery)) { // First pass: checks exact match of icon name.
		orderedResults.push(searchQuery);
		resultSet.add(searchQuery);
	}

	for (const iconName of iconNames) { // Second pass: checks exact match of keywords.
		if (iconName !== searchQuery && iconDefinitions[iconName].search.terms.includes(searchQuery)) {
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
