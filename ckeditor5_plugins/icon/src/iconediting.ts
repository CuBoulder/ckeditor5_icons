/**
 * @file defines schemas, converters, and commands for the icon plugin.
 */

import type { PluginInterface } from '@ckeditor/ckeditor5-core/src/plugin';
import type { PluginDependencies } from 'ckeditor5/src/core';
import { Plugin } from 'ckeditor5/src/core';
import { Widget, toWidget } from 'ckeditor5/src/widget';
import type { DowncastWriter } from 'ckeditor5/src/engine';
import type ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';
import type ContainerElement from '@ckeditor/ckeditor5-engine/src/view/containerelement';
import InsertIconCommand from './inserticoncommand';
import ModifyIconCommand from './modifyiconcommand';
import type { Size, Alignment, SizeAttributeDefinition, AlignmentAttributeDefinition, ModelAttribute, ModelAttributeDefiniton } from './iconconfig';
import { sizeOptions, sizeDefault, alignmentOptions, alignmentDefault } from './iconconfig';
import type { SelectableOption } from './icontypes';

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
export default class IconEditing extends Plugin implements PluginInterface {
	/**
	 * @inheritdoc
	 */
	public static get requires(): PluginDependencies {
		return [Widget] as const;
	}

	/**
	 * @inheritdoc
	 */
	public init() {
		this._defineSchema();
		this._defineConverters();
		this._defineCommands();
	}

	/**
	 * This registers the structure that will be seen by CKEditor 5 as
	 * &lt;icon&gt;&lt;/icon&gt;
	 *
	 * The logic in _defineConverters() will determine how this is converted to
	 * markup.
	 */
	private _defineSchema() {
		// Schemas are registered via the central `editor` object.
		const schema = this.editor.model.schema;

		const allowAttributes: ModelAttribute[] = ['iconClass', 'iconSize', 'iconAlignment'];

		schema.register('icon', {
			// Behaves like a self-contained object (e.g. an image).
			isObject: true,
			// Allows placement of the object to be inline with text.
			isInline: true,
			// Allows an icon to be inserted wherever text is allowed (including another container such as a button).
			allowWhere: '$text',
			// Allow the attributes which control the icon's class, size, and alignment.
			allowAttributes
		});
	}

	/**
	 * Converters determine how CKEditor 5 models are converted into markup and
	 * vice-versa.
	 */
	private _defineConverters() {
		// Defines the regex for detecting an icon's style.
		const styleRegex = /(fa-(solid|regular|light|thin|duotone|brands))|fas|far|fal|fad|fab/;

		// Converters are registered via the central editor object.
		const { conversion } = this.editor;

		// Stores the style and name of a FontAwesome icon in an attribute.
		conversion.for('upcast').attributeToAttribute({
			model: {
				key: 'iconClass',
				value: (viewElement: Element) => {
					if (!viewElement.hasAttribute('class'))
						return '';
					const classNames = viewElement.getAttribute('class')!.match(/(fa-([a-z0-9\-]+)|fas|far|fal|fad|fab)/g);
					let iconClass = '';
					if (classNames) {
						for (const className of classNames) {
							if (!className.match(/fa-(2xs|xs|sm|lg|xl|2xl|([0-9]|10)x)/) && !className.match(/fa-(pull-left|pull-right)/)) // Filters out the dedicated attributes.
								iconClass = iconClass ? iconClass + ' ' + className : className;
						}
					}
					return iconClass;
				}
			},
			view: 'class'
		});

		// The size and alignment attributes converts to element class names.
		conversion.attributeToAttribute(buildAttributeToAttributeClassNameDefinition<Size, SizeAttributeDefinition>('iconSize', sizeOptions));
		conversion.attributeToAttribute(buildAttributeToAttributeClassNameDefinition<Alignment, AlignmentAttributeDefinition>('iconAlignment', alignmentOptions));

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
	private _defineCommands() {
		const editor = this.editor, commands = editor.commands;
		commands.add('insertIcon', new InsertIconCommand(editor));
		commands.add('sizeIcon', new ModifyIconCommand<Size, SizeAttributeDefinition>(editor, 'iconSize', sizeDefault));
		commands.add('alignIcon', new ModifyIconCommand<Alignment, AlignmentAttributeDefinition>(editor, 'iconAlignment', alignmentDefault));
	}
}

/**
 * @param attributeName 
 *   The attribute name.
 * @param attributeOptions
 *   The options avaliable for the attribute.
 * @returns 
 *   The attribute to attribute definition of the specified attribute.
 */
function buildAttributeToAttributeClassNameDefinition<T extends string, D extends ModelAttributeDefiniton<T>>(attributeName: D[1], attributeOptions: Record<T, SelectableOption>) {
	const view: { [key: string]: { key: 'class', value: string } } = {};
	const values: string[] = [];
	for (const [value, option] of Object.entries<SelectableOption>(attributeOptions)) {
		if (!option.className) continue;
		values.push(value);
		view[value] = { key: 'class', value: option.className };
	}
	return {
		model: {
			key: attributeName,
			values: values
		},
		view: view
	};
}

/**
 * @param modelElement
 *   The model element.
 * @param viewWriter
 *   The downcast writer.
 * @returns
 *   The icon container element or widget.
 */
function createIconView(modelElement: ModelElement, viewWriter: DowncastWriter): ContainerElement {
	const iconClass = modelElement.getAttribute('iconClass');
	return viewWriter.createContainerElement('i', { class: iconClass });
}

/**
* @param modelElement
 *   The model element.
 * @param viewWriter
 *   The downcast writer.
 * @returns
 *   The icon container element or widget.
 */
function createIconWidgetView(modelElement: ModelElement, viewWriter: DowncastWriter): ContainerElement {
	const iconClass = modelElement.getAttribute('iconClass');
	return toWidget(
		viewWriter.createContainerElement('span', { class: 'ckeditor5-icons__widget' }, [viewWriter.createRawElement('span', {}, element => element.innerHTML = '<i class="' + iconClass + '"></i>')]), viewWriter, { label: 'icon widget' }
	);
}
