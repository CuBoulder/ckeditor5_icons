<?php

/**
 * @file
 * Contains \Drupal\ckeditor5_icons\CKEditor5IconsInterface.
 */

namespace Drupal\ckeditor5_icons;

interface CKEditor5IconsInterface {
	/**
	 * @return array
	 *   The precise version designations of the Font Awesome libraries.
	 */
	public function getPreciseLibraryVersions();

	/**
	 * @param mixed $faVersion
	 *   A likely valid Font Awesome version (optional).
	 * @return array
	 *   The Font Awesome category metadata for a given Font Awesome version (defaults to 6).
	 */
	public function getFACategories($faVersion);

	/**
	 * @param mixed $faVersion
	 *   A likely valid Font Awesome version (optional).
	 * @return array
	 *   The Font Awesome icon metadata for a given Font Awesome version (defaults to 6).
	 */
	public function getFAIcons($faVersion);

	/**
	 * @return array
	 *   All the available Font Awesome styles.
	 */
	public function getFAStyles();

	/**
	 * @param mixed $faVersion
	 *   A likely valid Font Awesome version (optional).
	 * @return string
	 *   '5' or '6' as a valid Font Awesome version (defaults to 6).
	 */
	public function toValidFAVersion($faVersion);

}
