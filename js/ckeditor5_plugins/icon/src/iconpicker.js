/**
 * @file registers the icon picker and binds functionality to it.
 * 
 * @typedef { import('./iconconfig').FontAwesomeVersion } FontAwesomeVersion
 * @typedef { import('./iconconfig').CategoryDefinition } CategoryDefinition
 * @typedef { import('./iconconfig').IconDefinition } IconDefinition
 * @typedef { import('@types/ckeditor__ckeditor5-utils').Locale } Locale
 * @typedef { import('@types/ckeditor__ckeditor5-core').Command } Command
 * @typedef { import('@types/ckeditor__ckeditor5-ui/src/dropdown/dropdownview').default } DropdownView
 * @typedef { import('@types/ckeditor__ckeditor5-core/src/editor/editorwithui').EditorWithUI } EditorWithUI
 * @typedef { import('./iconconfig').SelectableOption } SelectableOption
 */

import { createDropdown } from 'ckeditor5/src/ui';
import { Plugin } from 'ckeditor5/src/core';
import iconIcon from '../../../../icons/icon.svg';
import IconPickerView from './view/iconpickerview';
import { getFAStyleClass } from './iconutils';
import { faStyleLabels } from './iconconfig';

export default class IconPicker extends Plugin {
	/**
	 * @inheritdoc
	 */
	init() {
		const { commands, config, ui } = this.editor,
			command = commands.get('insertIcon'),
			componentFactory = ui.componentFactory;

		/** @type {FontAwesomeVersion} */
		const faVersion = config.get('icon.faVersion');

		/** @type {Object<string, CategoryDefinition>} */
		const faCategories = config.get('icon.faCategories');

		/** @type {Object<string, IconDefinition>} */
		const faIcons = config.get('icon.faIcons');

		/** @type {string[]?} */
		const recommendedIcons = config.get('icon.recommendedIcons');

		const styles = Object.keys(faStyleLabels);

		// This will register the icon toolbar button.
		componentFactory.add('icon', (locale) => {
			const dropdownView = createDropdown(locale);
			let iconPickerView;

			// Create the toolbar button.
			dropdownView.buttonView.set({
				label: locale.t('Icons'),
				icon: iconIcon,
				tooltip: true
			});

			// Bind the state of the button to the command.
			dropdownView.bind('isEnabled').to(command, 'isEnabled');

			dropdownView.on('change:isOpen', () => {
				if (!iconPickerView) {
					iconPickerView = new IconPickerView(locale, faVersion, faCategories, faIcons, styles, recommendedIcons);
					this.listenTo(iconPickerView, 'execute', () => { // Inserts the icon when the icon picker view fires the `execute` event.
						const { iconName, iconStyle } = iconPickerView;
						command.execute({ iconClass: getFAStyleClass(faVersion, iconStyle) + ' fa-' + iconName });
					});
					dropdownView.panelView.children.add(iconPickerView);
				} else if (!dropdownView.isOpen)
					iconPickerView.fire('cancel');
			});

			return dropdownView;
		});
	}
}
