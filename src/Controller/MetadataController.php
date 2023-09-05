<?php

namespace Drupal\ckeditor5_icons\Controller;

use Drupal\ckeditor5_icons\CKEditor5IconsInterface;
use Drupal\Component\Serialization\Json;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class MetadataController extends ControllerBase implements ContainerInjectionInterface {
	/**
	 * The current HTTP request.
	 * 
	 * @var \Symfony\Component\HttpFoundation\Request
	 */
	protected $request;

	/**
	 * The module's service
	 * 
	 * @var \Drupal\ckeditor5_plugins\CKEditor5IconsInterface
	 */
	protected $service;

	/**
	 * Constructs a ConfigureIconForm object.
	 * 
	 * @param \Symfony\Component\HttpFoundation\Request $request
	 *   The current HTTP request.
	 * @param \Drupal\ckeditor5_plugins\CKEditor5IconsInterface $service
	 *   The module's service.
	 */
	public function __construct(Request $request, CKEditor5IconsInterface $service) {
		$this->request = $request;
		$this->service = $service;
	}

	/**
	 * {@inheritdoc}
	 */
	public static function create(ContainerInterface $container) {
		return new static(
			$container->get('request_stack')->getCurrentRequest(),
			$container->get('ckeditor5_icons.CKEditor5Icons')
		);
	}

	/**
	 * Gets a JSON response for asynchronous loading of the Font Awesome 6 metadata.
	 * 
	 * @return \Symfony\Component\HttpFoundation\Response
	 *   The HTTP response containing the Font Awesome 6 metadata JSON.
	 */
	public function getFontAwesome6MetadataResponse() {
		$response = new Response();
		$this->addHeaders($response);
		$response->setContent(Json::encode([
			'version' => $this->service->getPreciseLibraryVersions()['fontawesome6'],
			'categories' => $this->service->getFACategories('6'),
			'icons' => $this->service->getFAIcons('6')
		]));
		return $response;
	}

	/**
	 * Gets a JSON response for asynchronous loading of the Font Awesome 5 metadata.
	 * 
	 * @return \Symfony\Component\HttpFoundation\Response
	 *   The HTTP response containing the Font Awesome 5 metadata JSON.
	 */
	public function getFontAwesome5MetadataResponse() {
		$response = new Response();
		$this->addHeaders($response);
		$response->setContent(Json::encode([
			'version' => $this->service->getPreciseLibraryVersions()['fontawesome5'],
			'categories' => $this->service->getFACategories('5'),
			'icons' => $this->service->getFAIcons('5')
		]));
		return $response;
	}

	/**
	 * Adds any required headers to the response.
	 * 
	 * @param \Symfony\Component\HttpFoundation\Response $response
	 *   The response to add the headers to.
	 */
	protected function addHeaders($response) {
		$response->headers->set('Content-Type', 'application/json');
		$response->headers->set('Access-Control-Allow-Origin', $this->request->getSchemeAndHttpHost());
	}
}
