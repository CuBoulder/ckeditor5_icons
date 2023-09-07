<?php

/**
 * @file
 * Contains \Drupal\ckeditor5_icons\PluginForm\IconForm.
 */

namespace Drupal\ckeditor5_icons\PluginForm;

use Drupal\ckeditor5_icons\CKEditor5IconsInterface;
use Drupal\Component\Serialization\Json;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Plugin\PluginFormBase;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Symfony\Component\DependencyInjection\ContainerInterface;

class ConfigureIconForm extends PluginFormBase implements ContainerInjectionInterface {
	use StringTranslationTrait;

	/**
	 * The example icons to show in "Recommended icons".
	 */
	protected const recommendedDefaultIcons = ['drupal', 'plus', 'font-awesome', 'equals', 'heart'];

	/**
	 * @inheritdoc
	 * 
	 * @var \Drupal\ckeditor5_plugins\Plugin\CKEditor5Plugin\Icon
	 */
	protected $plugin;

	/**
	 * The module handler.
	 * 
	 * @var \Drupal\Core\Extension\ModuleHandlerInterface
	 */
	protected $moduleHandler;

	/**
	 * The module's service.
	 * 
	 * @var \Drupal\ckeditor5_plugins\CKEditor5IconsInterface
	 */
	protected $service;

	/**
	 * Constructs a ConfigureIconForm object.
	 * 
	 * @param \Drupal\Core\Extension\ModuleHandlerInterface $moduleHandler
	 *   The module handler.
	 * @param \Drupal\ckeditor5_plugins\CKEditor5IconsInterface $service
	 *   The module's service.
	 */
	public function __construct(ModuleHandlerInterface $moduleHandler, CKEditor5IconsInterface $service) {
		$this->moduleHandler = $moduleHandler;
		$this->service = $service;
	}

	/**
	 * {@inheritdoc}
	 */
	public static function create(ContainerInterface $container) {
		return new static(
			$container->get('module_handler'),
			$container->get('ckeditor5_icons.CKEditor5Icons')
		);
	}

	/**
	 * {@inheritdoc}
	 */
	public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
		$libraryVersions = $this->service->getPreciseLibraryVersions();
		$faStyles = $this->service->getFAStyles();
		$configuration = $this->plugin->getConfiguration();
		$editorConfig = $this->plugin->getPluginDefinition()->getCKEditor5Config()['icon'];
		$faModuleExists = $this->moduleHandler->moduleExists('fontawesome');

		$form['fa_version'] = [
			'#type' => 'select',
			'#title' => $this->t('Font Awesome library version'),
			'#description' => $this->t('The selected version must match the version of the library included on your site.'),
			'#default_value' => isset($configuration['fa_version']) ? $configuration['fa_version'] : $editorConfig['faVersion'],
			'#options' => [
				'6' => 'Font Awesome 6',
				'5' => 'Font Awesome 5'
			]
		];
		$form['custom_metadata'] = [
			'#type' => 'select',
			'#title' => $this->t('Font Awesome metadata'),
			'#description' => $this->t('The Font Awesome Free metadata uses version @fa_6_v or @fa_5_v. To supply Font Awesome Pro metadata or a custom version, select Custom.', ['@fa_6_v' => $libraryVersions['fontawesome6'], '@fa_5_v' => $libraryVersions['fontawesome5'], '@fa_module_link' => 'https://www.drupal.org/project/fontawesome']),
			'#default_value' => $faModuleExists ? $configuration['custom_metadata'] : 0,
			'#options' => [
				$this->t('Font Awesome Free'),
				$this->t('Custom')
			]
		];
		$form['async_metadata'] = [
			'#type' => 'checkbox',
			'#title' => $this->t('Load metadata asynchronously'),
			'#description' => $this->t('Loads the Font Awesome metadata only when the icon picker is opened to decrease page size and load time. It\'s recommended to leave this enabled except for troubleshooting problems.'),
			'#default_value' => $configuration['async_metadata']
		];
		$form['fa_styles'] = [
			'#type' => 'fieldset',
			'#title' => $this->t('Font Awesome styles'),
			'#open' => true
		];
		array_walk($faStyles, function($style, $styleName) use ($configuration, $editorConfig, &$form) {
			$formElementId = 'fa_styles_' . $styleName;
			$form['fa_styles'][$formElementId] = [
				'#type' => 'checkbox',
				'#title' => $this->t($style['label']),
				'#default_value' => in_array($styleName, isset($configuration['fa_styles']) ? $configuration['fa_styles'] : $editorConfig['faStyles'])
			];
			if ($style['pro'])
				$form['fa_styles'][$formElementId]['#description'] = $this->t('Requires Font Awesome Pro.');
		});
		$form['recommended_enabled'] = [
			'#type' => 'checkbox',
			'#title' => $this->t('Show the Recommended category'),
			'#default_value' => $configuration['recommended_enabled'] || $editorConfig['recommendedIcons'] !== null
		];
		$form['recommended_icons'] = [
			'#type' => 'textfield',
			'#title' => $this->t('Recommended icons'),
			'#description' => $this->t('Comma-separated icon names to display in the Recommended category. For a complete list of icon names visit <a target="_blank" href="@fa_url">Font Awesome\'s website</a>.', ['@fa_url' => 'https://fontawesome.com/search?m=free']),
			'#default_value' => implode(',', isset($configuration['recommended_icons']) ? $configuration['recommended_icons'] : ($editorConfig['recommendedIcons'] === null ? self::recommendedDefaultIcons : $editorConfig['recommendedIcons']))
		];

		return $form;
	}

	/**
	 * {@inheritdoc}
	 */
	public function validateConfigurationForm(array &$form, FormStateInterface $form_state) {
		$faStyles = $this->service->getFAStyles();
		$customMetadata = (bool) $form_state->getValue('custom_metadata');
		$selectedStyles = [];

		array_walk($faStyles, function($style, $styleName) use ($form_state, &$form, &$selectedStyles, $customMetadata) {
			$formElementId = 'fa_styles_' . $styleName;
			if ($form_state->getValue('fa_styles')[$formElementId])
				$selectedStyles[] = $styleName;
		});

		$form_state->setValue('fa_version', $this->service->toValidFAVersion($form_state->getValue('fa_version')));
		$form_state->setValue('fa_styles', $selectedStyles);
		$form_state->setValue('custom_metadata', $customMetadata);
		$form_state->setValue('async_metatdata', (bool) $form_state->getValue('async_metatdata'));
		$form_state->setValue('recommended_enabled', (bool) $form_state->getValue('recommended_enabled'));
		$form_state->setValue('recommended_icons', array_filter(array_map(function ($value) { return preg_replace('/([^a-z0-9\-]+)/', '', strtolower($value)); }, explode(',', $form_state->getValue('recommended_icons')))));

		if (!$this->moduleHandler->moduleExists('fontawesome') && $form_state->getValue('custom_metadata'))
			$form_state->setError($form['custom_metadata'], $this->t('<a target="_blank" href="@fa_module_link">Font Awesome Icons</a> must be installed to use custom Font Awesome metadata.', ['@fa_module_link' => 'https://www.drupal.org/project/fontawesome']));
	}

	/**
	 * {@inheritdoc}
	 */
	public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
		$configuration = $this->plugin->getConfiguration();
	
		$configuration['fa_version'] = $form_state->getValue('fa_version');
		$configuration['fa_styles'] = $form_state->getValue('fa_styles');
		$configuration['custom_metadata'] = $form_state->getValue('custom_metadata');
		$configuration['async_metadata'] = $form_state->getValue('async_metadata');
		$configuration['recommended_enabled'] = $form_state->getValue('recommended_enabled');
		$recommendedIcons = $form_state->getValue('recommended_icons');
		if ($configuration['recommended_enabled'] || isset($configuration['recommended_icons']) || $recommendedIcons != static::recommendedDefaultIcons)
			$configuration['recommended_icons'] = $form_state->getValue('recommended_icons');
	
		$this->plugin->setConfiguration($configuration);
	}
}
