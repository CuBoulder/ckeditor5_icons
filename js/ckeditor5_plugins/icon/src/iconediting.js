/**
 * @file defines schemas, converters, and commands for the icon plugin.
 * 
 * @typedef { import('./iconconfig').SelectableOption } SelectableOption
 * @typedef { import('@ckeditor/ckeditor5-engine').DowncastWriter } DowncastWriter
 * @typedef { import('@ckeditor/ckeditor5-engine/src/model/element').default } ModelElement
 * @typedef { import('@ckeditor/ckeditor5-engine/src/view/containerelement').default } ContainerElement
 */

import { Plugin } from 'ckeditor5/src/core';
import { toWidget } from 'ckeditor5/src/widget';
import { Widget } from 'ckeditor5/src/widget';
import InsertIconCommand from './inserticoncommand';
import ModifyIconCommand from './modifyiconcommand';
import { sizeOptions, sizeDefault, alignmentOptions, alignmentDefault } from './iconconfig';

// cSpell:ignore icon inserticoncommand

/**
 * CKEditor 5 plugins do not work directly with the DOM. They are defined as
 * plugin-specific data models that are then converted to markup that
 * is inserted in the DOM.
 *
 * CKEditor 5 internally interacts with icon as this model:
 * <icon></icon>
 *
 * Which is converted for the browser/user as this markup
 * <i></i>
 *
 * This file has the logic for defining the icon model, and for how it is
 * converted to standard DOM markup.
 */
export default class IconEditing extends Plugin {
	/**
	 * @inheritdoc
	 */
	static get requires() {
		return [Widget];
	}

	/**
	 * @inheritdoc
	 */
	init() {
		this._defineSchema();
		this._defineConverters();
		this._defineCommands();
	}

	/*
	 * This registers the structure that will be seen by CKEditor 5 as
	 * <icon></icon>
	 *
	 * The logic in _defineConverters() will determine how this is converted to
	 * markup.
	 */
	_defineSchema() {
		// Schemas are registered via the central `editor` object.
		const schema = this.editor.model.schema;

		schema.register('icon', {
			// Behaves like a self-contained object (e.g. an image).
			isObject: true,
			// Allows placement of the object to be inline with text.
			isInline: true,
			// Allows an icon to be inserted wherever text is allowed (including another container such as a button).
			allowWhere: '$text',
			// Allow the attributes which control the icon's class, size, and alignment.
			allowAttributes: ['iconClass', 'iconSize', 'iconAlignment']
		});
	}

	/**
	 * Converters determine how CKEditor 5 models are converted into markup and
	 * vice-versa.
	 */
	_defineConverters() {
		// Defines the regex for detecting an icon's style.
		const styleRegex = /(fa-(solid|regular|light|thin|duotone|brands))|fas|far|fal|fad|fab/;

		// Converters are registered via the central editor object.
		const { conversion } = this.editor;

		// Stores the style and name of a FontAwesome icon in an attribute.
		conversion.for('upcast').attributeToAttribute({
			model: {
				key: 'iconClass',
				value: viewElement => {
					if (!viewElement.hasAttribute('class'))
						return;
					const classNames = viewElement.getAttribute('class').match(/(fa-([a-z0-9\-]+)|fas|far|fal|fad|fab)/g);
					let iconClass = '';
					for (let className of classNames) {
						if (!className.match(/fa-(2xs|xs|sm|lg|xl|2xl|([0-9]|10)x)/) && !className.match(/fa-(pull-left|pull-right)/)) // Filters out the dedicated attributes.
							iconClass = iconClass ? iconClass + ' ' + className : className;
					}
					return iconClass;
				}
			},
			view: 'class'
		});

		// The size and alignment attributes converts to element class names.
		conversion.attributeToAttribute(buildAttributeToAttributeDefinition('iconSize', sizeOptions));
		conversion.attributeToAttribute(buildAttributeToAttributeDefinition('iconAlignment', alignmentOptions));

		// Upcast Converters: determine how existing HTML is interpreted by the
		// editor. These trigger when an editor instance loads.
		//
		// If <i> is present in the existing markup
		// processed by CKEditor, then CKEditor recognizes and loads it as a
		// <icon> model.
		conversion.for('upcast').elementToElement({
			model: 'icon',
			view: {
				name: 'i',
				classes: styleRegex
			}
		});

		// Data Downcast Converters: converts stored model data into HTML.
		// These trigger when content is saved.
		//
		// Instances of <icon> are saved as
		// <i></i>.
		conversion.for('dataDowncast').elementToElement({
			model: 'icon',
			view: (modelElement, { writer: viewWriter }) => createIconView(modelElement, viewWriter)
		});

		// Editing Downcast Converters. These render the content to the user for
		// editing, i.e. this determines what gets seen in the editor. These trigger
		// after the Data Upcast Converters, and are re-triggered any time there
		// are changes to any of the models' properties.
		//
		// Convert the <icon> model into a container widget in the editor UI.
		conversion.for('editingDowncast').elementToElement({
			model: 'icon',
			view: (modelElement, { writer: viewWriter }) => createIconWidgetView(modelElement, viewWriter)
		});
	}

	/**
	 * Defines the commands for inserting or modifying the icon.
	 */
	_defineCommands() {
		const editor = this.editor, commands = editor.commands;
		commands.add('insertIcon', new InsertIconCommand(editor));
		commands.add('sizeIcon', new ModifyIconCommand(editor, 'iconSize', sizeDefault));
		commands.add('alignIcon', new ModifyIconCommand(editor, 'iconAlignment', sizeDefault));
	}
}

/**
 * @param {string} attributeName 
 *   The attribute name.
 * @param {Object<string, SelectableOption>} attributeOptions
 *   The options avaliable for the attribute.
 * @returns 
 *   The attribute to attribute definition of the specified attribute.
 */
function buildAttributeToAttributeDefinition(attributeName, attributeOptions) {
	const view = {}, values = [];
	for (const [value, option] of Object.entries(attributeOptions)) {
		if (!option.className) continue;
		values.push(value);
		view[value] = { key: 'class', value: option.className };
	}
	return {
		model: {
			key: attributeName,
			values: values
		},
		view
	};
}

/**
 * @param {ModelElement} modelElement
 *   The model element.
 * @param {DowncastWriter} viewWriter
 *   The downcast writer.
 * @returns {ContainerElement}
 *   The icon container element or widget.
 */
function createIconView(modelElement, viewWriter) {
	const iconClass = modelElement.getAttribute('iconClass');
	return viewWriter.createContainerElement('i', { class: iconClass });
}

/**
* @param {ModelElement} modelElement
 *   The model element.
 * @param {DowncastWriter} viewWriter
 *   The downcast writer.
 * @returns {ContainerElement}
 *   The icon container element or widget.
 */
function createIconWidgetView(modelElement, viewWriter) {
	const iconClass = modelElement.getAttribute('iconClass');
	return toWidget(
		viewWriter.createContainerElement('span', { class: 'ckeditor5-icons__widget' }, [viewWriter.createRawElement('span', {}, element => element.innerHTML = '<i class="' + iconClass + '"></i>')]), viewWriter, { label: 'icon widget' }
	);
}
