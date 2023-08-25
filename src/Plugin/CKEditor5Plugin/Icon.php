<?php

/**
 * @file
 * Contains \Drupal\ckeditor5_icons\Plugin\CKEditor5Plugin\Icon.
 */

namespace Drupal\ckeditor5_icons\Plugin\CKEditor5Plugin;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\ckeditor5_icons\CKEditor5IconsManagerInterface;
use Drupal\ckeditor5\Plugin\CKEditor5PluginConfigurableInterface;
use Drupal\ckeditor5\Plugin\CKEditor5PluginConfigurableTrait;
use Drupal\ckeditor5\Plugin\CKEditor5PluginDefault;
use Drupal\editor\EditorInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * CKEditor 5 Icon plugin.
 *
 * @internal
 *   Plugin classes are internal.
 */
class Icon extends CKEditor5PluginDefault implements CKEditor5PluginConfigurableInterface, ContainerFactoryPluginInterface {
	use CKEditor5PluginConfigurableTrait;

	/**
	 * The CKEditor5 icons manager.
	 * 
	 * @var \Drupal\ckeditor5_plugins\CKEditor5IconsManagerInterface
	 */
	protected $manager;

	/**
	 * Constructs an Icon object.
	 *
	 * @param array $configuration
	 *   A configuration array containing information about the plugin instance.
	 * @param string $plugin_id
	 *   The plugin ID for the plugin instance.
	 * @param mixed $plugin_definition
	 *   The plugin implementation definition.
	 * @param \Drupal\ckeditor5_plugins\CKEditor5IconsManagerInterface $manager
	 *   The extension path resolver.
	 */
	public function __construct(array $configuration, $plugin_id, $plugin_definition, CKEditor5IconsManagerInterface $manager) {
		parent::__construct($configuration, $plugin_id, $plugin_definition);
		$this->manager = $manager;
	}

	/**
	 * {@inheritdoc}
	 */
	public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
		return new static(
			$configuration,
			$plugin_id,
			$plugin_definition,
			$container->get('ckeditor5_icons.CKEditor5IconsManager')
		);
	}

	/**
	 * {@inheritdoc}
	 */
	public function defaultConfiguration() {
		return [
			'fa_version' => '6',
			'recommended_enabled' => FALSE,
			'recommended_icons' => ['drupal', 'plus', 'font-awesome', 'equals', 'heart']
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
			'#description' => $this->t('The selected version must match the version of the library included on your site.'),
			'#options' => [
				'6' => 'Font Awesome 6',
				'5' => 'Font Awesome 5'
			],
			'#default_value' => $this->configuration['fa_version']
		];
		$form['recommended_enabled'] = [
			'#type' => 'checkbox',
			'#title' => $this->t('Show the Recommended category'),
			'#default_value' => $this->configuration['recommended_enabled']
		];
		$form['recommended_icons'] = [
			'#type' => 'textfield',
			'#title' => $this->t('Recommended icons'),
			'#description' => $this->t('Comma-separated icon names to display in the Recommended category. For a complete list of icon names visit <a target="_blank" href="@fa_url">Font Awesome\'s website</a>.', ['@fa_url' => 'https://fontawesome.com/search?m=free']),
			'#default_value' => implode(',', $this->configuration['recommended_icons'])
		];
		return $form;
	}

	/**
	 * {@inheritdoc}
	 */
	public function validateConfigurationForm(array &$form, FormStateInterface $form_state) {
		$form_state->setValue('fa_version', $this->manager->toValidFAVersion($form_state->getValue('fa_version')));
		$form_state->setValue('recommended_enabled', (bool) $form_state->getValue('recommended_enabled'));
		$form_state->setValue('recommended_icons', array_filter(array_map(function($value) {
				return preg_replace('/([^a-z0-9\-]+)/', '', strtolower($value));
			}, explode(',', $form_state->getValue('recommended_icons')))));
	}

	/**
	 * {@inheritdoc}
	 */
	public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
		$this->configuration['fa_version'] = $form_state->getValue('fa_version');
		$this->configuration['recommended_enabled'] = $form_state->getValue('recommended_enabled');
		$this->configuration['recommended_icons'] = $form_state->getValue('recommended_icons');
	}

	/**
	 * {@inheritdoc}
	 */
	public function getDynamicPluginConfig(array $static_plugin_config, EditorInterface $editor): array {
		$faVersion = $this->configuration['fa_version'];
		return [
			'icon' => [
				'faVersion' => $faVersion,
				'faCategories' => $this->manager->getFACategories($faVersion),
				'faIcons' => $this->manager->getFAIcons($faVersion),
				'recommendedIcons' => $this->configuration['recommended_enabled'] ? $this->configuration['recommended_icons'] : null
			]
		];
	}
}
