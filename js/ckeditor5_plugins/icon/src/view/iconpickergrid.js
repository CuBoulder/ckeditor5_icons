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

		this.tiles = this.createCollection();
		this.sections = new Collection();

		this.tilesView = new View();
		this.tilesView.setTemplate({
			tag: 'div',
			attributes: {
				class: [
					'ck',
					'ckeditor5-icons__grid-tiles'
				]
			}
		});

		this.showMoreButtonView = new ButtonView(locale);
		this.showMoreButtonView.set({
			label: '',
			withText: true,
			isVisible: false,
			class: ['ck', 'ckeditor5-icons__grid-show-more']
		});

		this.setTemplate({
			tag: 'div',
			attributes: {
				class: [
					'ck',
					'ck-character-grid',
					'ckeditor5-icons__grid'
				]
			},
			children: [
				this.tilesView,
				{
					tag: 'div',
					attributes: {
						class: [
							'ck',
							'ckeditor5-icons__grid-options'
						]
					},
					children: [this.showMoreButtonView]
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
			gridItems: this.tiles,
			numberOfColumns: () => global.window
				.getComputedStyle(this.tilesView.element.firstChild) // Responsive .ck-character-grid__tiles
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
		this.tiles.clear();
	
		for (const section of this.sections)
			this.tilesView.deregisterChild(section);
		this.tilesView.element.innerText = '';
		this.sections.clear();
	
		this._populateGrid(this.categoryDefinition.icons, iconDefinitions);
	}

	/**
	 * @inheritdoc
	 */
	render() {
		super.render();

		for (const item of this.tiles)
			this.focusTracker.add(item.element);

		this.tiles.on('change', (eventInfo, { added, removed }) => {
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
			const item = this.tiles.find(item => item.isOn);
			if (item) {
				item.focus();
				return;
			}
		}
		const first = this.tiles.first;
		if (first)
			first.focus();
	}

	_populateGrid(iconNames, iconDefinitions, startAt = 0) {
		const max = 200, length = iconNames.length - startAt, section = new View(), sectionTiles = new Collection();
		for (let index = 0; index < Math.min(max, length); index++) {
			const iconName = iconNames[startAt + index], iconDefinition = iconDefinitions[iconName];
			if (iconDefinition) {
				const item = this._createItem(iconName, iconDefinitions[iconName])
				sectionTiles.add(item);
				this.tiles.add(item);
			}
		}

		const buttonView = this.showMoreButtonView;
		if (length > max) {
			const t = this.locale.t;
			buttonView.set('label', t('Show more') + ' (' + (length - max) + ')');
			buttonView.set('isVisible', true);
			this.listenTo(buttonView, 'execute', () => {
				this.tiles.last.focus();
				this._populateGrid(iconNames, iconDefinitions, startAt + max);
			});
			this.fire('showMorePossible', true);
		} else {
			this.stopListening(buttonView, 'execute');
			this.fire('showMorePossible', false);
			buttonView.set('isVisible', false);
		}

		section.setTemplate({
			tag: 'div',
			attributes: {
				class: ['ck', 'ck-character-grid__tiles']
			},
			children: sectionTiles
		});

		this.sections.add(section);
		this.tilesView.registerChild(section);
		this.tilesView.element.appendChild(section.element);
	}
}
