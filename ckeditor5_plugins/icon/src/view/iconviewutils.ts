/**
 * @file defines utility functions for views.
 */

import { ButtonView } from 'ckeditor5/src/ui';

/**
 * @param locale
 *   The locale.
 * @param label
 *   The button's label.
 * @param icon
 *   The button's icon (optional).
 * @param  className
 *   The button's class (optional).
 * @param withText
 *   Set to force text display even if the button has an icon.
 * @returns
 *   A button with the specified parameters.
 */
export function createButton(label: string, icon?: string | null, className?: string | null, withText?: boolean | string | null): ButtonView {
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
