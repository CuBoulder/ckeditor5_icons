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
	 * The exact version of Font Awesome 6 metadata being used.
	 */
	const fa6Version = '6.4.2';

	/**
	 * The exact version of Font Awesome 5 metadata being used.
	 */
	const fa5Version = '5.15.4';

	/**
	 * Defines the available Font Awesome styles.
	 */
	const faStyles = [
		'solid' => ['label' => 'Solid', 'pro' => false],
		'regular' => ['label' => 'Regular', 'pro' => false],
		'light' => ['label' => 'Light', 'pro' => true],
		'thin' => ['label' => 'Thin', 'pro' => true],
		'duotone' => ['label' => 'Duotone', 'pro' => true],
		'brands' => ['label' => 'Brands', 'pro' => false]
	];

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
			'fa_styles' => ['solid', 'regular', 'brands'],
			'custom_metadata' => false,
			'async_metadata' => true,
			'recommended_enabled' => false,
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
			'#default_value' => $this->configuration['fa_version'],
			'#options' => [
				'6' => 'Font Awesome 6',
				'5' => 'Font Awesome 5'
			]
		];
		$form['custom_metadata'] = [
			'#type' => 'select',
			'#title' => $this->t('Font Awesome metadata'),
			'#description' => $this->t('The included metadata uses %fa_free version @fa_6_v or @fa_5_v. Custom metadata is provided by the <a target="_blank" href="@fa_module_link">Font Awesome Icons</a> module which must be installed (required to use %fa_pro).', ['%fa_free' => 'Font Awesome Free', '%fa_pro' => 'Font Awesome Pro', '@fa_6_v' => self::fa6Version, '@fa_5_v' => self::fa5Version, '@fa_module_link' => 'https://www.drupal.org/project/fontawesome']),
			'#default_value' => $this->configuration['custom_metadata'],
			'#options' => [
				'Font Awesome Free',
				$this->t('Custom')
			]
		];
		$form['async_metadata'] = [
			'#type' => 'checkbox',
			'#title' => $this->t('Load metadata asynchronously'),
			'#description' => $this->t('Loads the Font Awesome metadata only when the icon picker is opened to decrease page size and load time.'),
			'#default_value' => $this->configuration['async_metadata']
		];
		$form['fa_styles'] = [
			'#type' => 'checkboxes',
			'#title' => $this->t('Enabled styles'),
			'#description' => $this->t('Icons and styles exclusive to %fa_pro will not function properly when using the included %fa_free metadata and require the <a target="_blank" href="@fa_module_link">Font Awesome Icons</a> module. The "Thin" style requires Font Awesome 6.', ['%fa_pro' => 'Font Awesome Pro', '%fa_free' => 'Font Awesome Free', '@fa_module_link' => 'https://www.drupal.org/project/fontawesome']),
			'#default_value' => $this->configuration['fa_styles'],
			'#options' => array_map(function ($style) { return $style['label'] . ($style['pro'] ? ' (' . $this->t('requires %fa_pro', ['%fa_pro' => 'Font Awesome Pro']) . ')' : ''); }, self::faStyles)
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
		$form_state->setValue('fa_styles', array_keys(array_filter($form_state->getValue('fa_styles'), function ($key) { return isset(self::faStyles[$key]); })));
		$form_state->setValue('async_metatdata', (bool) $form_state->getValue('async_metatdata'));
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
		$this->configuration['fa_styles'] = $form_state->getValue('fa_styles');
		$this->configuration['async_metadata'] = $form_state->getValue('async_metadata');
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
				'faStyles' => $this->configuration['fa_styles'],
				'recommendedIcons' => $this->configuration['recommended_enabled'] ? $this->configuration['recommended_icons'] : null
			]
		];
	}
}
