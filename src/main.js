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

		'leaflet': 'http://cdn.leafletjs.com/leaflet-0.7.2/leaflet',
		'leaflet-css': 'http://cdn.leafletjs.com/leaflet-0.7.2/leaflet',

		'gw2': 'src/jsco.gw2.js',
		'gw2api': 'src/gw2-api-wrapper.js',

		'gw2map': 'src/gw2/gw2map.js',

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

		'leaflet': {
			deps: ['load!leaflet-css', 'jquery'],
			exports: 'L',
		},

		'gw2': {
			deps: ['order!jquery', 'order!gw2api'],
		},

		'gw2api': {
			deps: ['jquery'],
		},

		'gw2map': {
			deps: ['order!jquery''order!gw2api', 'order!gw2'],
		},
	},
});

require(['order!jquery'], function()
{
	console.log($);
});

//require(["leaflet"], function()
//{
//    console.log(L);
//});

//define(['css!leaflet-css', 'leaflet'], { });