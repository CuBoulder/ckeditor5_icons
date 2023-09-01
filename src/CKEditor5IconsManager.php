<?php

/**
 * @file
 * Contains \Drupal\ckeditor5_icons\CKEditor5IconsManager.
 */

namespace Drupal\ckeditor5_icons;

use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\Core\Extension\ExtensionPathResolver;
use Symfony\Component\Yaml\Yaml;

class CKEditor5IconsManager implements CKEditor5IconsManagerInterface {

	/**
	 * The data cache.
	 *
	 * @var \Drupal\Core\Cache\CacheBackendInterface
	 */
	protected $dataCache;

	/**
	 * The extension path resolver.
	 *
	 * @var \Drupal\Core\Extension\ExtensionPathResolver
	 */
	protected $extensionPathResolver;

	/**
	 * Constructs a CKEditor5IconsManager object.
	 *
	 * @param \Drupal\Core\Cache\CacheBackendInterface $data_cache
	 *   The data cache.
	 * @param \Drupal\Core\Extension\ExtensionPathResolver $extensionPathResolver
	 *   The extension path resolver.
	 */
	public function __construct(CacheBackendInterface $data_cache, ExtensionPathResolver $extensionPathResolver) {
		$this->dataCache = $data_cache;
		$this->extensionPathResolver = $extensionPathResolver;
	}

	/**
	 * @inheritdoc
	 */
	public function getPreciseLibraryVersions() {
		$cacheId = 'ckeditor5_icons.library_versions';
		$cached = $this->dataCache->get($cacheId);
		if ($cached)
			return $cached->data;
		$data = Yaml::parseFile($this->extensionPathResolver->getPath('module', 'ckeditor5_icons') . '/libraries/versions.yml');
		$this->dataCache->set($cacheId, $data);
		return $data;
	}

	/**
	 * @inheritdoc
	 */
	public function getFACategories($faVersion) {
		$faVersion = $this->toValidFAVersion($faVersion);
		$cacheId = 'ckeditor5_icons.fontawesome' . $faVersion . '.categories';
		$cached = $this->dataCache->get($cacheId);
		if ($cached)
			return $cached->data;
		$data = Yaml::parseFile($this->extensionPathResolver->getPath('module', 'ckeditor5_icons') . '/libraries/fontawesome' . $faVersion . '/metadata/categories.yml');
		$this->dataCache->set($cacheId, $data);
		return $data;
	}

	/**
	 * @inheritdoc
	 */
	public function getFAIcons($faVersion) {
		$faVersion = $this->toValidFAVersion($faVersion);
		$cacheId = 'ckeditor5_icons.fontawesome' . $faVersion . '.icons';
		$cached = $this->dataCache->get($cacheId);
		if ($cached)
			return $cached->data;
		$data = array_map(function($icon) {
			return [
				'styles' => $icon['styles'],
				'label' => $icon['label'],
				'search' => $icon['search']
			];
		}, Yaml::parseFile($this->extensionPathResolver->getPath('module', 'ckeditor5_icons') . '/libraries/fontawesome' . $faVersion . '/metadata/icons.yml'));
		$this->dataCache->set($cacheId, $data);
		return $data;
	}

	/**
	 * @inheritdoc
	 */
	public function toValidFAVersion($faVersion) {
		return $faVersion === '5' ? $faVersion : '6';
	}
}
