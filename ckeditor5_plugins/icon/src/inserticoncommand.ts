/**
 * @file defines InsertIconCommand, which is executed when the icon toolbar button is pressed.
 */

import { Command } from 'ckeditor5/src/core';
import type { DocumentSelection, Element, Model } from 'ckeditor5/src/engine';
import { findOptimalInsertionRange } from 'ckeditor5/src/widget';

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
		const { document, schema } = model;

		// Determine if the cursor (selection) is in a position where adding a
		// icon is permitted. This is based on the schema of the model(s)
		// currently containing the cursor.
		const allowedIn = schema.checkChild(getParentElement(document.selection, model), 'icon');

		// If the cursor is not in a location where a icon can be added, return
		// null so the addition doesn't happen.
		this.isEnabled = allowedIn !== null;
	}
}

/**
 * @returns
 *   The parent element to evalute whether an icon can be inserted as a child.
 */
function getParentElement(selection: DocumentSelection, model: Model): Element {
	const parent = findOptimalInsertionRange(selection, model).start.parent;
	if (parent.isEmpty && !parent.is('element', '$root'))
		return parent.parent as Element;
	return parent as Element;
}
