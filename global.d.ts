/**
 * @file defines global module declarations.
 */

// The `ckeditor5` module (^30.0.0) doesn't contain TypeScript definitions.
// This is a workaround that enables TypeScript definitions for webpack DLL builds using it.

declare module 'ckeditor5/src/core' {
	export * from '@ckeditor/ckeditor5-core';
}

declare module 'ckeditor5/src/engine' {
	export * from '@ckeditor/ckeditor5-engine';
}

declare module 'ckeditor5/src/ui' {
	export * from '@ckeditor/ckeditor5-ui';
}

declare module 'ckeditor5/src/utils' {
	export * from '@ckeditor/ckeditor5-utils';
}

declare module 'ckeditor5/src/widget' {
	export * from '@ckeditor/ckeditor5-widget';
}


// Enables importing any Font Awesome 6 Free icons directly into the TypeScript.

declare module 'fontawesome6/svgs/solid/*.svg' {
	const content: string;
	export default content;
}

declare module 'fontawesome6/svgs/regular/*.svg' {
	const content: string;
	export default content;
}

declare module 'fontawesome6/svgs/brands/*.svg' {
	const content: string;
	export default content;
}
