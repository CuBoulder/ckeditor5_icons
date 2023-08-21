<?php

/**
 * @file
 * Contains \Drupal\ckeditor5_icons\CKEditor5IconsManagerInterface.
 */

namespace Drupal\ckeditor5_icons;

interface CKEditor5IconsManagerInterface {

	/**
	 * @param mixed $faVersion
	 *   A likely valid Font Awesome version (optional).
	 * @return
	 *   The Font Awesome category metadata for a given Font Awesome version (defaults to 6).
	 */
	public function getFACategories($faVersion);

	/**
	 * @param mixed $faVersion
	 *   A likely valid Font Awesome version (optional).
	 * @return
	 *   The Font Awesome icon metadata for a given Font Awesome version (defaults to 6).
	 */
	public function getFAIcons($faVersion);

	/**
	 * @param mixed $faVersion
	 *   A likely valid Font Awesome version (optional).
	 * @return string
	 *   '5' or '6' as a valid Font Awesome version (defaults to 6).
	 */
	public function toValidFAVersion($faVersion);

}
