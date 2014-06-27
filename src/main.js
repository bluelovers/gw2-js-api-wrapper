requirejs.config(
{
	'baseUrl': '..',

	paths: {
		'css': 'lib/requirejs/plugin/css',
		'order': 'lib/requirejs/plugin/order',
		'text': 'lib/requirejs/plugin/text',

		'load': 'lib/requirejs/plugin/load',

		'jquery': 'https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min',
		'jquery.selector.data': 'lib/jquery/plugin/jquery.selector.data',

		'jquery.stylesheet': 'lib/jquery/plugin/jquery-stylesheet/jquery.stylesheet',

		'jquery.plus': 'lib/jquery/plugin/jquery.plus',

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

		'gw2': 'src/jsco.gw2',
		'gw2api': 'src/gw2-api-wrapper',

		'gw2map': 'src/gw2/gw2map',
		'gw2css': 'src/gw2/gw2',

		'menomonia': 'https://d1h9a8s8eodvjz.cloudfront.net/fonts/menomonia/08-02-12/menomonia',
		'menomonia-italic': 'https://d1h9a8s8eodvjz.cloudfront.net/fonts/menomonia/08-02-12/menomonia-italic',

		'propertyParser': 'lib/requirejs/plugin/propertyParser',

	},

	map: {
		'*': {

		},
	},

	shim: {
		'jquery': {
			deps: [],
			//exports: '$',

			init: function()
			{
				console.log(['init', $]);
			},
		},

		'jquery.selector.data': ['jquery'],
		'jquery.stylesheet': ['jquery'],
		'jquery.plus': ['jquery'],

		'leaflet': {
			deps: ['load!leaflet-css', 'jquery'],
			exports: 'L',
		},

		'leaflet.markercluster': ['load!leaflet.markercluster-css', 'load!leaflet.markercluster-css-def'],

		'leaflet-plus': ['jquery', 'leaflet'],

		'gw2': ['order!jquery', 'order!gw2api', 'load!menomonia', 'load!menomonia-italic', 'load!gw2css'],

		'gw2api': ['jquery'],

		'gw2map': {
			deps: ['order!jquery', 'order!leaflet', 'order!gw2api', 'order!gw2', 'order!jquery.stylesheet'],
			exports: 'GW2MapApi',
		},
	},
});

define(['jquery', 'leaflet'], function($, L)
{
	// support Leaflet 0.8-dev
	window.L = L;
});

//require(["leaflet"], function()
//{
//    console.log(L);
//});

//define(['css!leaflet-css', 'leaflet'], { });