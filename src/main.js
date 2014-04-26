requirejs.config(
{
	'baseUrl': '..',

	paths: {
		'css': 'lib/requirejs/plugin/css',
		'order': 'lib/requirejs/plugin/order',
		'text': 'lib/requirejs/plugin/text',

		'jquery': 'https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min',

		'leaflet' : 'http://cdn.leafletjs.com/leaflet-0.7.2/leaflet',
		'leaflet-css' : 'http://cdn.leafletjs.com/leaflet-0.7.2/leaflet',

		'gw2' : 'src/jsco.gw2.js',
		'gw2api' : 'src/gw2-api-wrapper.js',
	},

	shim: {
		'jquery': {
			exports: '$',
		},

		'leaflet':
		{
			deps: ['css!leaflet-css', 'jquery'],
			exports: 'L',
		},

		'gw2': {
			deps: ['order!jquery', 'order!gw2api'],
		},

		'gw2api': {
			deps: ['jquery'],
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