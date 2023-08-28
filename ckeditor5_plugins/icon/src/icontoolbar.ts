/**
 * @file registers the icon toolbar and binds functionality to it.
 */

import type { PluginInterface } from '@ckeditor/ckeditor5-core/src/plugin';
import type { PluginDependencies } from 'ckeditor5/src/core';
import type { Locale, ObservableChangeEvent } from 'ckeditor5/src/utils';
import type { DropdownView } from 'ckeditor5/src/ui';
import { ButtonView, createDropdown, addToolbarToDropdown } from 'ckeditor5/src/ui';
import type { Size, Alignment } from './iconconfig';
import { sizeOptions, sizeDefault, alignmentOptions, alignmentDefault } from './iconconfig';
import { Plugin, icons } from 'ckeditor5/src/core';
import { WidgetToolbarRepository } from 'ckeditor5/src/widget';
import type { SelectableOption } from './icontypes';
import type ModifyIconCommand from './modifyiconcommand';

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
			componentFactory = editor.ui.componentFactory;

		// Makes size and alignment options avaliable to the widget toolbar.
		const sizeIconCommand = commands.get('sizeIcon')!;
		const alignIconCommand = commands.get('alignIcon')!;
		componentFactory.add('iconSize', locale =>
			this._createToolbarDropdown<Size>(locale, 'Icon size', sizeOptions[sizeDefault].icon, icons.objectSizeFull, sizeIconCommand, sizeOptions, sizeDefault));
		componentFactory.add('iconAlignment', locale =>
			this._createToolbarDropdown<Alignment>(locale, 'Icon alignment', alignmentOptions[alignmentDefault].icon, null, alignIconCommand, alignmentOptions, alignmentDefault));
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

	/**
	 * Creates a dropdown with multiple buttons for executing a command.
	 *
	 * @returns
	 *   The dropdown.
	 */
	private _createToolbarDropdown<T extends string>(locale: Locale, label: string, icon: string | null | undefined, fallbackIcon: string | null | undefined, command: ModifyIconCommand<T>, options: Record<T, SelectableOption>, defaultValue: T): DropdownView {
		const dropdownView = createDropdown(locale), buttonView = dropdownView.buttonView, t = locale.t;
		addToolbarToDropdown(dropdownView, Object.entries<SelectableOption>(options).map(([optionValue, option]: [T, SelectableOption]) => this._createToolbarButton<T>(locale, option.label, option.icon, command, optionValue)));
		buttonView.set({
			label: t(label),
			icon,
			tooltip: t(label),
			withText: !icon
		});
		if (icon === options[defaultValue].icon) { // If the icon for the dropdown is the same as the icon for the default option, it changes to reflect the current selection.
			this.listenTo<ObservableChangeEvent<T>>(command, 'change:value', (_eventInfo, _name, value) => {
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
	private _createToolbarButton<T extends string>(locale: Locale, label: string, icon: string | null | undefined, command: ModifyIconCommand<T>, value: T): ButtonView {
		const editor = this.editor, buttonView = new ButtonView();
		buttonView.set({
			label: locale.t(label),
			icon,
			tooltip: !!icon, // Displays the tooltip on hover
			isToggleable: true, // Allows the button with the command's current value to display as selected
			withText: !icon // Displays the button as text if the icon is falsey
		});
		// Disables the button if the command is disabled
		buttonView.bind('isEnabled').to(command);
		// Allows the button with the command's current value to display as selected
		buttonView.bind('isOn').to(command, 'value', commandValue => commandValue === value);
		// Executes the command with the button's value on click
		this.listenTo(buttonView, 'execute', () => {
			command.execute({ value });
			editor.editing.view.focus();
		});
		return buttonView;
	}
}
