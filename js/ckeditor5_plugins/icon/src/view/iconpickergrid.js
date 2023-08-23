/**
 * @file contains the icon picker grid view.
 * 
 * @typedef { import('../iconconfig').FontAwesomeVersion } FontAwesomeVersion
 * @typedef { import('../iconconfig').CategoryDefinition } CategoryDefinition
 * @typedef { import('../iconconfig').IconDefinition } IconDefinition
 * @typedef { import('@ckeditor/ckeditor5-utils').Locale } Locale
 */

import { FocusTracker, KeystrokeHandler } from "ckeditor5/src/utils";
import { View } from 'ckeditor5/src/ui';
import addKeyboardHandlingForGrid from '@ckeditor/ckeditor5-ui/src/bindings/addkeyboardhandlingforgrid';
import IconPickerItem from './iconpickeritem';

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
		this.items = this.createCollection();

		this.setTemplate({
			tag: 'div',
			children: [
				{
					tag: 'div',
					attributes: {
						class: [
							'ck',
							'ck-character-grid__tiles'
						]
					},
					children: this.items
				}
			],
			attributes: {
				class: [
					'ck',
					'ck-character-grid'
				]
			}
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
				.getComputedStyle(this.element.firstChild) // Responsive .ck-character-grid__tiles
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

		this.set('iconName', null);

		item.set({
			label: t(iconDefinition.label),
			class: 'ck-character-grid__tile'
		});

		item.extendTemplate({
			isOn: false,
			attributes: {
				title: t(iconDefinition.label)
			},
			on: {
				mouseover: item.bindTemplate.to('mouseover'),
				focus: item.bindTemplate.to('focus')
			}
		});

		item.on('mouseover', () => this.fire('itemHover', iconName, iconDefinition));
		item.on('focus', () => this.fire('itemFocus', iconName, iconDefinition));
		item.on('execute', () => this.fire('execute', iconName, iconDefinition));
		item.bind('isOn').to(this, 'iconName', value => iconName === value);

		return item;
	}

	/**
	 * Refreshes this icon picker grid based on a category selection.
	 * 
	 * @param {CategoryDefinition} categoryDefinition
	 * @param {Object<string, IconDefinition>} iconDefinition
	 */
	refresh(iconDefinitions) {
		this.items.clear();
		for (const iconName of this.categoryDefinition.icons) {
			const iconDefinition = iconDefinitions[iconName];
			if (iconDefinition)
				this.items.add(this._createItem(iconName, iconDefinitions[iconName]));
		}
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
}
