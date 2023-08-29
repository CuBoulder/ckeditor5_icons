/** 
 * @file defines ModifyIconCommand, which is executed to modify attributes of the icon from the widget toolbar.
 */

import { Command } from 'ckeditor5/src/core';
import { getSelectedIconWidget } from './iconutils';
import type { Editor } from 'ckeditor5/src/core';
import type { ModelAttributeDefiniton } from './iconconfig';

/**
 * Represents a command which is executed to modify attributes of the icon from the widget toolbar.
 */
export default class ModifyIconCommand<T extends string, D extends ModelAttributeDefiniton<T> = ModelAttributeDefiniton<T>> extends Command {
	/** 
	 * The name of the attribute this command modifies.
	 */
	private readonly attributeName: D[1];

	/**
	 * The default value to set if there isn't one specified.
	 */
	private readonly defaultValue: T;

	/**
	 * The value of this command.
	 */
	public override value: T;

	/**
	 * Constructs a new ModifyIconCommand.
	 * 
	 * @param editor 
	 *   The editor.
	 * @param attributeName 
	 *   The name of the attribute this command modifies.
	 * @param defaultValue 
	 *   The default value to set if there isn't one specified.
	 */
	public constructor(editor: Editor, attributeName: D[1], defaultValue: T) {
		super(editor);
		this.attributeName = attributeName;
		this.defaultValue = defaultValue;
		this.value = defaultValue;
	}

	/**
	 * @inheritdoc
	 */
	public override refresh() {
		const model = this.editor.model, iconWidget = getSelectedIconWidget(model.document.selection), attributeName = this.attributeName, defaultValue = this.defaultValue;
		this.isEnabled = !!iconWidget; // Disables any ModifyIconCommand if there is no selected icon
		if (this.isEnabled)
			this.value = iconWidget!.hasAttribute(attributeName) ? iconWidget!.getAttribute(attributeName) as T : defaultValue; // Sets the `value` of this ModifyIconCommand to the attribute of the selected icon
		else this.value = defaultValue;
	}

	/**
	 * @inheritdoc
	 */
	public override execute(options: { value: T } = { value: this.defaultValue }) {
		const model = this.editor.model, iconWidget = getSelectedIconWidget(model.document.selection), attributeName = this.attributeName, defaultValue = this.defaultValue;
		if (iconWidget)
			model.change(writer => writer.setAttribute(attributeName, options.value || defaultValue, iconWidget)); // Sets the attribute of the selected icon to a new value upon execution of this command
	}
}
