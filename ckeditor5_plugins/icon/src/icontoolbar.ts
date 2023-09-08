/**
 * @file registers the icon toolbar and binds functionality to it.
 */

import type { PluginInterface } from '@ckeditor/ckeditor5-core/src/plugin';
import type { PluginDependencies } from 'ckeditor5/src/core';
import type { Locale, ObservableChangeEvent } from 'ckeditor5/src/utils';
import type { ButtonExecuteEvent, DropdownView } from 'ckeditor5/src/ui';
import { ButtonView, createDropdown, addToolbarToDropdown } from 'ckeditor5/src/ui';
import type { Size, Alignment } from './iconconfig';
import { sizeOptions, sizeDefault, alignmentOptions, alignmentDefault } from './iconconfig';
import { Plugin, icons } from 'ckeditor5/src/core';
import { WidgetToolbarRepository } from 'ckeditor5/src/widget';
import type { FontAwesomeVersion, SelectableOption } from './icontypes';
import type ModifyIconCommand from './modifyiconcommand';
import { createButton } from './view/viewutils';

export default class IconToolbar extends Plugin implements PluginInterface {
	/**
	 * @inheritdoc
	 */
	public static get requires(): PluginDependencies {
		return [WidgetToolbarRepository] as const;
	}

	/**
	 * @inheritdoc
	 */
	public init() {
		const editor = this.editor,
			commands = editor.commands,
			componentFactory = editor.ui.componentFactory,
			faVersion = editor.config.get('icon.faVersion') || '6';

		// Makes size and alignment options avaliable to the widget toolbar.
		componentFactory.add('iconSize', locale =>
			createToolbarDropdown<Size>(locale, faVersion, 'Icon size', sizeOptions[sizeDefault].icon, icons.objectSizeFull, commands.get('sizeIcon')!, sizeOptions, sizeDefault));
		componentFactory.add('iconAlignment', locale =>
			createToolbarDropdown<Alignment>(locale, faVersion, 'Icon alignment', alignmentOptions[alignmentDefault].icon, null, commands.get('alignIcon')!, alignmentOptions, alignmentDefault));
	}

	/**
	 * @inheritdoc
	 */
	public afterInit() {
		const editor = this.editor;
		const widgetToolbarRepository = editor.plugins.get(WidgetToolbarRepository);
		widgetToolbarRepository.register('icon', {
			items: ['iconSize', 'iconAlignment'],
			getRelatedElement: (selection) => {
				const selectedElement = selection.getSelectedElement();
				return selectedElement && selectedElement.is('element') && selectedElement.hasClass('ckeditor5-icons__widget') ? selectedElement : null;
			}
		});
	}
}

/**
 * Creates a dropdown with multiple buttons for executing a command.
 *
 * @returns
 *   The dropdown.
 */
function createToolbarDropdown<T extends string>(locale: Locale, faVersion: FontAwesomeVersion, label: string, icon: string | null | undefined, fallbackIcon: string | null | undefined, command: ModifyIconCommand<T>, options: Record<T, SelectableOption>, defaultValue: T): DropdownView {
	const dropdownView = createDropdown(locale), buttonView = dropdownView.buttonView, t = locale.t;
	addToolbarToDropdown(dropdownView, Object.entries<SelectableOption>(options).filter(([_optionValue, option]) => !option.compatibility || option.compatibility.includes(faVersion)).map(([optionValue, option]: [T, SelectableOption]) =>
		createToolbarButton<T>(locale, option.label, option.icon, command, optionValue)));
	buttonView.set({
		label: t(label),
		icon,
		tooltip: t(label),
		withText: !icon
	});
	if (icon === options[defaultValue].icon) { // If the icon for the dropdown is the same as the icon for the default option, it changes to reflect the current selection.
		command.on<ObservableChangeEvent<T>>('change:value', (_eventInfo, _name, value) => {
			const selectableOption: SelectableOption = options[value];
			buttonView.set('label', t(selectableOption.label));
			buttonView.set('icon', selectableOption.icon || fallbackIcon || undefined);
			buttonView.set('withText', !selectableOption.icon);
		});
	}
	// Enable button if any of the buttons are enabled.
	dropdownView.bind('isEnabled').to(command, 'isEnabled');
	return dropdownView;
}

/**
 * @returns
 *   A button with the specified parameters.
 */
function createToolbarButton<T extends string>(locale: Locale, label: string, icon: string | null | undefined, command: ModifyIconCommand<T>, value: T): ButtonView {
	const editor = command.editor, buttonView = createButton(locale, label, icon);
	buttonView.tooltip = !!icon; // Displays the tooltip on hover.
	buttonView.isToggleable = true; // Allows the button with the command's current value to display as selected.
	// Disables the button if the command is disabled.
	buttonView.bind('isEnabled').to(command);
	// Allows the button with the command's current value to display as selected.
	buttonView.bind('isOn').to(command, 'value', commandValue => commandValue === value);
	// Executes the command with the button's value on click.
	buttonView.on<ButtonExecuteEvent>('execute', () => {
		command.execute({ value });
		editor.editing.view.focus();
	});
	return buttonView;
}
