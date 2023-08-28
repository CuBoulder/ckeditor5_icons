/**
 * @file defines InsertIconCommand, which is executed when the icon toolbar button is pressed.
 */

import { Command } from 'ckeditor5/src/core';

/**
 * Represents a command which is executed when the icon toolbar button is pressed.
 */
export default class InsertIconCommand extends Command {
	/**
	 * @inheritdoc
	 */
	public override execute({ iconClass = 'fa-solid fa-chess-rook' }) {
		const { editing, model } = this.editor;

		model.change((writer) => {
			// Insert <icon></icon> at the current selection position
			// in a way that will result in creating a valid model structure.
			const iconElement = writer.createElement('icon', { iconClass });
			model.insertContent(iconElement);
			editing.view.focus();
			writer.setSelection(iconElement, 'on');
		});
	}

	/**
	 * @inheritdoc
	 */
	public override refresh() {
		const { model } = this.editor;
		const { selection } = model.document;

		// Determine if the cursor (selection) is in a position where adding a
		// icon is permitted. This is based on the schema of the model(s)
		// currently containing the cursor.
		const allowedIn = model.schema.findAllowedParent(
			selection.getFirstPosition()!,
			'icon'
		);

		// If the cursor is not in a location where a icon can be added, return
		// null so the addition doesn't happen.
		this.isEnabled = allowedIn !== null;
	}
}
