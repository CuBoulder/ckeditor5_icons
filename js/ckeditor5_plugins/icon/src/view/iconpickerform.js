/**
 * @file contains the icon picker submit form.
 * 
 * @typedef { import('@ckeditor/ckeditor5-utils').Locale } Locale
 * @typedef { import('@ckeditor/ckeditor5-ui/src/dropdown/dropdownview').default } DropdownView
 * @typedef { import('@ckeditor/ckeditor5-ui/src/dropdown/utils').ListDropdownItemDefinition } ListDropdownItemDefinition
 */

import { addListToDropdown, ButtonView, createDropdown, Model, submitHandler, View } from 'ckeditor5/src/ui';
import { icons } from 'ckeditor5/src/core';
import { Collection } from 'ckeditor5/src/utils';
import { faStyleLabels } from '../iconconfig';

export default class IconPickerForm extends View {
	/**
	 * Creates a new IconPickerForm.
	 * 
	 * @param {Locale} locale 
	 *   The locale.
	 */
	constructor(locale) {
		super(locale);

		const bind = this.bindTemplate, t = locale.t;

		this.styleDropdownView = this._createStyleDropdown(locale);
		this.styleDropdownView.bind('value').to(this, 'iconStyle');
		/** @type {Collection<ListDropdownItemDefinition>} */
		this.styleDropdownItems = new Collection();
		addListToDropdown(this.styleDropdownView, this.styleDropdownItems);

		this.submitButtonView = createButton(t('Insert'), icons.check, 'ck-button-save');
		// Submit type of the button will trigger the submit event on entire form when clicked 
		//(see submitHandler() in render() below).
		this.submitButtonView.type = 'submit';

		this.cancelButtonView = createButton(t('Cancel'), icons.cancel, 'ck-button-cancel');
		this.cancelButtonView.delegate('execute').to(this, 'cancel');

		this.setTemplate({
			tag: 'form',
			attributes: {
				class: ['ck', 'ckeditor5-icons__picker-form', bind.to('iconName', value => value ? '' : 'ck-hidden')]
			},
			children: [this.styleDropdownView, this.submitButtonView, this.cancelButtonView]
		});
	}

	/**
	 * Refreshes the style selection dropdown.
	 * 
	 * @param {string[]} faStyles
	 *   The enabled Font Awesome icon styles.
	 */
	refresh(faStyles) {
		const dropdownView = this.styleDropdownView, items = this.styleDropdownItems, t = this.locale.t;

		items.clear();
	
		for (const name of this.iconDefinition.styles) {
			if (!faStyles.includes(name))
				continue; // Must be a valid Font Awesome style.
			const model = new Model({
				name,
				label: t(faStyleLabels[name]),
				withText: true
			});
			model.bind('isOn').to(dropdownView, 'value', value => value === name);
			items.add({ type: 'button', model });
		}
	}

	/**
	 * @inheritdoc
	 */
	render() {
		super.render();

		submitHandler({
			view: this
		});
	}

	/**
	 * Focuses the submit button.
	 */
	focus() {
		if (this.submitButtonView.isEnabled)
			this.submitButtonView.focus();
	}

	/**
	 * @param {Locale} locale
	 *   The locale.
	 * @returns {DropdownView}
	 *   The style selection dropdown.
	 */
	_createStyleDropdown(locale) {
		const dropdownView = createDropdown(locale), defaultLabel = 'Select a style', t = locale.t;

		dropdownView.buttonView.set({
			label: t(defaultLabel),
			tooltip: t('Styles available for this icon'),
			withText: true,
			class: 'ck-dropdown__button_label-width_auto'
		});
		dropdownView.buttonView.bind('label').to(this, 'iconStyle', value => t(value ? faStyleLabels[value] || value : defaultLabel));
		dropdownView.on('execute', eventInfo => {
			const iconStyle = eventInfo.source.name;
			dropdownView.set('value', iconStyle);
			this.fire('changeStyle', iconStyle);
		});

		return dropdownView;
	}
}

/**
 * @param {Locale} locale
 *   The locale.
 * @param {string} label
 *   The button's label.
 * @param {string?} icon
 *   The button's icon (optional).
 * @param {string?} className
 *   The button's class (optional).
 * @param {boolean | string | null} withText
 *   Set to force text display even if the button has an icon.
 * @returns {ButtonView}
 *   A button with the specified parameters.
 */
function createButton(label, icon, className, withText) {
	const button = new ButtonView();

	button.set({
		label: typeof withText === 'string' ? withText : label,
		icon,
		tooltip: icon ? label : false,
		withText: withText || !icon,
		class: className
	});

	return button;
}
