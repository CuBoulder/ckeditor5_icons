/**
 * @file registers the icon picker and binds functionality to it.
 */

import type { PluginInterface } from '@ckeditor/ckeditor5-core/src/plugin';
import { Plugin } from 'ckeditor5/src/core';
import { createDropdown } from 'ckeditor5/src/ui';
import iconsIcon from 'fontawesome6/svgs/solid/icons.svg';
import type { InsertIconEvent } from './view/iconpickerview';
import IconPickerView from './view/iconpickerview';
import { getFAStyleClass } from './iconutils';
import { faStyleLabels } from './iconconfig';
import type { FontAwesomeStyle, FontAwesomeVersion, CategoryDefinitions, IconDefinitions, IconName } from './icontypes';

export default class IconPicker extends Plugin implements PluginInterface {
	/**
	 * @inheritdoc
 	*/
	public init() {
		const { commands, config, ui } = this.editor,
			command = commands.get('insertIcon')!,
			componentFactory = ui.componentFactory;

		const faVersion: FontAwesomeVersion = config.get('icon.faVersion') || '6';
		const faCategories: CategoryDefinitions = config.get('icon.faCategories') || {};
		const faIcons: IconDefinitions = config.get('icon.faIcons') || {};
		const faStyles: FontAwesomeStyle[] | undefined = config.get('icon.faStyles');
		const recommendedIcons: IconName[] | null | undefined = config.get('icon.recommendedIcons');
		let styles: FontAwesomeStyle[] = (Object.keys(faStyleLabels) as FontAwesomeStyle[]);
		if (faStyles)
			styles = styles.filter(value => faStyles.includes(value));

		// Registers the icon toolbar button.
		componentFactory.add('icon', locale => {
			const dropdownView = createDropdown(locale);
			let iconPickerView: IconPickerView;

			// Creates the toolbar button.
			dropdownView.buttonView.set({
				label: locale.t('Icons'),
				icon: iconsIcon,
				tooltip: true
			});

			// Binds the state of the button to the command.
			dropdownView.bind('isEnabled').to(command, 'isEnabled');

			// Handles the opening of the icon picker modal.
			dropdownView.on('change:isOpen', () => {
				if (!iconPickerView) {
					iconPickerView = new IconPickerView(locale, faVersion, faCategories, faIcons, styles, recommendedIcons);
					this.listenTo<InsertIconEvent>(iconPickerView, 'execute', (_eventInfo, iconName, iconStyle) => { // Inserts the icon when the icon picker view fires the `execute` event.
						command.execute({ iconClass: getFAStyleClass(faVersion, iconStyle) + ' fa-' + iconName });
					});
					dropdownView.panelView.children.add(iconPickerView);
				}
			});

			return dropdownView;
		});
	}
}
