<?php

/**
 * @file
 * Contains \Drupal\ckeditor5_icons\Plugin\CKEditor5Plugin\Icon.
 */

namespace Drupal\ckeditor5_icons\Plugin\CKEditor5Plugin;

use Drupal\Core\Extension\ExtensionPathResolver;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\ckeditor5\Plugin\CKEditor5PluginConfigurableInterface;
use Drupal\ckeditor5\Plugin\CKEditor5PluginConfigurableTrait;
use Drupal\ckeditor5\Plugin\CKEditor5PluginDefault;
use Drupal\editor\EditorInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Yaml\Yaml;

/**
 * CKEditor 5 Icon plugin.
 *
 * @internal
 *   Plugin classes are internal.
 */
class Icon extends CKEditor5PluginDefault implements CKEditor5PluginConfigurableInterface, ContainerFactoryPluginInterface {
	use CKEditor5PluginConfigurableTrait;

	/**
	 * The Font Awesome category metadata.
	 * 
	 * @var array
	 */
	protected $faCategories;

	/**
	 * The Font Awesome icon metadata.
	 * 
	 * @var array
	 */
	protected $faIcons;

	/**
	 * Constructs an Icon object.
	 *
	 * @param array $configuration
	 *   A configuration array containing information about the plugin instance.
	 * @param string $plugin_id
	 *   The plugin ID for the plugin instance.
	 * @param mixed $plugin_definition
	 *   The plugin implementation definition.
	 * @param \Drupal\Core\Extension\ExtensionPathResolver $extensionPathResolver
	 *   The extension path resolver.
	 */
	public function __construct(array $configuration, $plugin_id, $plugin_definition, ExtensionPathResolver $extensionPathResolver) {
		parent::__construct($configuration, $plugin_id, $plugin_definition);
		// TODO: Cache in a service to avoid opening and parsing the files with each page load
		$modulePath = $extensionPathResolver->getPath('module', 'ckeditor5_icons');
		$this->faCategories = Yaml::parseFile($modulePath . (isset($configuration['fa_version']) && $configuration['fa_version'] == '5' ? '/libraries/fontawesome5/metadata/categories.yml' : '/libraries/fontawesome6/metadata/categories.yml'));
		$this->faIcons = array_map(function($item) {
			return [
				'styles' => $item['styles'],
				'label' => $item['label']
			];
		}, Yaml::parseFile($modulePath . (isset($configuration['fa_version']) && $configuration['fa_version'] == '5' ? '/libraries/fontawesome5/metadata/icons.yml' : '/libraries/fontawesome6/metadata/icons.yml')));
	}

	/**
	 * {@inheritdoc}
	 */
	public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
		return new static(
			$configuration,
			$plugin_id,
			$plugin_definition,
			$container->get('extension.path.resolver')
		);
	}

	/**
	 * {@inheritdoc}
	 */
	public function defaultConfiguration() {
		return [
			'fa_version' => '6'
		];
	}

	/**
	 * {@inheritdoc}
	 *
	 * Form for choosing which alignment types are available.
	 */
	public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
		$form['fa_version'] = [
			'#type' => 'select',
			'#title' => $this->t('Font Awesome library version'),
			'#options' => [
				'6' => 'Font Awesome 6',
				'5' => 'Font Awesome 5'
			],
			'#default_value' => $this->configuration['fa_version']
		];
		return $form;
	}

	/**
	 * {@inheritdoc}
	 */
	public function validateConfigurationForm(array &$form, FormStateInterface $form_state) {
		$form_value = $form_state->getValue('fa_version');
		$config_value = $form_value == '5' ? $form_value : '6';
		$form_state->setValue('fa_version', $config_value);
	}

	/**
	 * {@inheritdoc}
	 */
	public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
		$this->configuration['fa_version'] = $form_state->getValue('fa_version');
	}


	/**
	 * {@inheritdoc}
	 */
	public function getDynamicPluginConfig(array $static_plugin_config, EditorInterface $editor): array {
		return [
			'icon' => [
				'faVersion' => $this->configuration['fa_version'],
				'faCategories' => $this->faCategories,
				'faIcons' => $this->faIcons
			]
		];
	}
}
