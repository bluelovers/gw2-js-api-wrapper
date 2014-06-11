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

		'propertyParser': 'lib/requirejs/plugin/propertyParser',

	},

	map: {
		'*': {

		},
	},

	shim: {
		'jquery': {
			deps: [],
			exports: '$',

			init: function()
			{
				console.log(['init', $]);
			},
		},

		'jquery.selector.data': {
			deps: ['jquery'],
		},

		'jquery.plus': {
			deps: ['jquery'],
		},

		'leaflet': {
			deps: ['load!leaflet-css', 'jquery'],
			exports: 'L',
		},

		'leaflet.markercluster': {
			deps: ['load!leaflet.markercluster-css', 'load!leaflet.markercluster-css-def'],
		},

		'leaflet-plus': {
			deps: ['order!jquery', 'order!leaflet'],
		},

		'gw2': {
			deps: ['order!jquery', 'order!gw2api'],
		},

		'gw2api': {
			deps: ['jquery'],
		},

		'gw2map': {
			deps: ['order!jquery', 'order!leaflet', 'order!gw2api', 'order!gw2'],
			exports: 'GW2MapApi',
		},
	},
});

require(['jquery', 'leaflet'], function($, L)
{
	// support Leaflet 0.8-dev
	window.L = L;

	console.log($);
});

//require(["leaflet"], function()
//{
//    console.log(L);
//});

//define(['css!leaflet-css', 'leaflet'], { });