<?php

/**
 * @file
 * Contains \Drupal\ckeditor5_icons\CKEditor5Icons.
 */

namespace Drupal\ckeditor5_icons;

use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\Core\Extension\ExtensionPathResolver;
use Symfony\Component\Yaml\Yaml;

class CKEditor5Icons implements CKEditor5IconsInterface {
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
	 * Constructs a CKEditor5Icons object.
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
		$data = array_map(function ($icon) {
			return [
				'styles' => $icon['styles'],
				'label' => $icon['label'],
				'search' => ['terms' => array_map(function ($value) { return trim($value); }, $icon['search']['terms'])]
			];
		}, Yaml::parseFile($this->extensionPathResolver->getPath('module', 'ckeditor5_icons') . '/libraries/fontawesome' . $faVersion . '/metadata/icons.yml'));
		$this->dataCache->set($cacheId, $data);
		return $data;
	}

	/**
	 * @inheritdoc
	 */
	public function getFAStyles() {
		return [
			'solid' => [
				'label' => 'Solid',
				'pro' => FALSE,
				'compatibility' => ['5', '6']
			],
			'regular' => [
				'label' => 'Regular',
				'pro' => FALSE,
				'compatibility' => ['5', '6']
			],
			'light' => [
				'label' => 'Light',
				'pro' => TRUE,
				'compatibility' => ['5', '6']
			],
			'thin' => [
				'label' => 'Thin',
				'pro' => TRUE,
				'compatibility' => ['6']
			],
			'duotone' => [
				'label' => 'Duotone',
				'pro' => TRUE,
				'compatibility' => ['5', '6']
			],
			'brands' => [
				'label' => 'Brands',
				'pro' => FALSE,
				'compatibility' => ['5', '6']
			]
		];
	}

	/**
	 * @inheritdoc
	 */
	public function toValidFAVersion($value) {
		return $value === '5' ? $value : '6';
	}
}
