<?php

/**
 * @file
 * Contains \Drupal\ckeditor5_icons\Plugin\CKEditor5Plugin\Icon.
 */

namespace Drupal\ckeditor5_icons\Plugin\CKEditor5Plugin;

use Drupal\Core\Form\FormStateInterface;
use Drupal\ckeditor5\Plugin\CKEditor5PluginConfigurableInterface;
use Drupal\ckeditor5\Plugin\CKEditor5PluginConfigurableTrait;
use Drupal\ckeditor5\Plugin\CKEditor5PluginDefault;
use Drupal\ckeditor5_icons\CKEditor5IconsInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Plugin\PluginFormFactoryInterface;
use Drupal\Core\Plugin\PluginWithFormsInterface;
use Drupal\editor\EditorInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * CKEditor 5 Icon plugin.
 *
 * @internal
 *   Plugin classes are internal.
 */
class Icon extends CKEditor5PluginDefault implements CKEditor5PluginConfigurableInterface, PluginWithFormsInterface, ContainerFactoryPluginInterface {
	use CKEditor5PluginConfigurableTrait;

	/**
	 * The plugin form.
	 * 
	 * @var \Drupal\Core\Plugin\PluginFormInterface
	 */
	protected $form;

	/**
	 * The module's service.
	 * 
	 * @var \Drupal\ckeditor5_icons\CKEditor5IconsInterface
	 */
	protected $service;

	/**
	 * Constructs an Icon object.
	 *
	 * @param array $configuration
	 *   A configuration array containing information about the plugin instance.
	 * @param string $plugin_id
	 *   The plugin ID for the plugin instance.
	 * @param mixed $plugin_definition
	 *   The plugin implementation definition.
	 * @param \Drupal\Core\Plugin\PluginFormFactoryInterface $pluginFormFactory
	 *   The plugin form factory.
	 * @param \Drupal\ckeditor5_icons\CKEditor5IconsInterface $service
	 *   The module's service.
	 */
	public function __construct(array $configuration, $plugin_id, $plugin_definition, PluginFormFactoryInterface $pluginFormFactory, CKEditor5IconsInterface $service) {
		parent::__construct($configuration, $plugin_id, $plugin_definition);
		$this->form = $pluginFormFactory->createInstance($this, 'configure');
		$this->service = $service;
	}

	/**
	 * {@inheritdoc}
	 */
	public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
		return new static(
			$configuration,
			$plugin_id,
			$plugin_definition,
			$container->get('plugin_form.factory'),
			$container->get('ckeditor5_icons.CKEditor5Icons')
		);
	}

	/**
	 * {@inheritdoc}
	 */
	public function defaultConfiguration() {
		return [
			'custom_metadata' => false,
			'async_metadata' => true,
			'recommended_enabled' => false
		];
	}

	/**
	 * {@inheritdoc}
	 */
	public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
		return $this->form->buildConfigurationForm($form, $form_state);
	}

	/**
	 * {@inheritdoc}
	 */
	public function validateConfigurationForm(array &$form, FormStateInterface $form_state) {
		$this->form->validateConfigurationForm($form, $form_state);
	}

	/**
	 * {@inheritdoc}
	 */
	public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
		$this->form->submitConfigurationForm($form, $form_state);
	}

	/**
	 * {@inheritdoc}
	 */
	public function getDynamicPluginConfig(array $static_plugin_config, EditorInterface $editor): array {
		$dynamicConfig = [];
		if (isset($this->configuration['fa_version'])) {
			$faVersion = $this->configuration['fa_version'];
			$dynamicConfig['faVersion'] = $faVersion;
		} else $faVersion = $static_plugin_config['faVersion'];
		$dynamicConfig['faCategories'] = $this->service->getFACategories($faVersion);
		$dynamicConfig['faIcons'] = $this->service->getFAIcons($faVersion);
		if (isset($this->configuration['fa_styles']))
			$dynamicConfig['faStyles'] = $this->configuration['fa_styles'];
		if ($this->configuration['recommended_enabled'] && isset($this->configuration['recommended_icons']))
			$dynamicConfig['recommendedIcons'] = $this->configuration['recommended_icons'];
		return ['icon' => $dynamicConfig];
	}

	/**
	 * @inheritdoc
	 */
	public function hasFormClass($operation) {
		return true;
	}

	/**
	 * @inheritdoc
	 */
	public function getFormClass($operation) {
		return 'Drupal\ckeditor5_icons\PluginForm\ConfigureIconForm';
	}
}
