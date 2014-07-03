define(['lib/requirejs/extend/require.extend'], function()
{
	requirejs.config(
	{
		//'baseUrl': '..',

		paths: {
			'css': 'lib/requirejs/plugin/css',
			'order': 'lib/requirejs/plugin/order',
			'text': 'lib/requirejs/plugin/text',
			'i18n': 'lib/requirejs/plugin/i18n',
			'load': 'lib/requirejs/plugin/load',
			'domReady': 'lib/requirejs/plugin/domReady',

			'propertyParser': 'lib/requirejs/plugin/propertyParser',
		},

		map: {
			'*': {

			},
		},

	});

	requirejs.config(
	{

		paths: {
			'scriptpath': 'lib/others/scriptpath',
		},

		shim: {
			'scriptpath': {
				exports: 'getScriptPath',
			},
		},

	});

	//console.log([getScriptPath().path()]);

	requirejs.config(
	{
		paths: {
			'jquery': [
				'https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min',
				'lib/jquery/jquery',
			],

			'jquery.selector.data': 'lib/jquery/plugin/jquery.selector.data',

			'jquery.stylesheet': 'lib/jquery/plugin/jquery-stylesheet/jquery.stylesheet',

			'jquery.plus': 'lib/jquery/plugin/jquery.plus',

			'jquery.base64': 'lib/jquery/plugin/jquery.base64/jquery.base64',
		},

		shim: {
			'jquery': {
				exports: '$',
			},

			'jquery.selector.data': ['jquery'],
			'jquery.stylesheet': ['jquery'],
			'jquery.plus': ['jquery'],
			'jquery.base64': ['jquery'],
		},

	});

	requirejs.config(
	{
		paths: {
			'leaflet': [
				'http://leaflet-cdn.s3.amazonaws.com/build/master/leaflet-src',
				'http://cdn.leafletjs.com/leaflet-0.7.3/leaflet',
				'lib/leafletjs/leaflet'
				],
			'leaflet-css': [
				'http://leaflet-cdn.s3.amazonaws.com/build/master/leaflet',
				'http://cdn.leafletjs.com/leaflet-0.7.3/leaflet',
				'lib/leafletjs/leaflet'
				],

			'leaflet.markercluster': 'http://leaflet.github.io/Leaflet.markercluster/dist/leaflet.markercluster-src.js',
			'leaflet.markercluster-css': 'http://leaflet.github.io/Leaflet.markercluster/dist/MarkerCluster.css',
			'leaflet.markercluster-css-def': 'http://leaflet.github.io/Leaflet.markercluster/dist/MarkerCluster.Default.css',

			'leaflet-plus': 'lib/leafletjs/plugin/leaflet.plus',
		},

		shim: {
			'leaflet': {
				deps: ['load!leaflet-css'],
				exports: 'L',
			},

			'leaflet.markercluster': ['load!leaflet.markercluster-css', 'load!leaflet.markercluster-css-def'],

			'leaflet-plus': ['jquery', 'leaflet'],
		},
	});

	requirejs.config(
	{
		paths: {
			'gw2api': 'src/gw2/gw2api',

			'gw2css': 'src/gw2/gw2',

			'menomonia': 'https://d1h9a8s8eodvjz.cloudfront.net/fonts/menomonia/08-02-12/menomonia',
			'menomonia-italic': 'https://d1h9a8s8eodvjz.cloudfront.net/fonts/menomonia/08-02-12/menomonia-italic',
		},

		shim: {

			'gw2api': {
				deps: ['load!gw2css', 'jquery', 'jquery.base64'],
			},

			'gw2css': {
				deps: ['load!menomonia', 'load!menomonia-italic'],
			},
		},
	});

});