requirejs.config(
{
	'baseUrl': '..',

	paths: {
		'requirejs': 'lib/requirejs',
	},

	deps: ['requirejs/bootstrap'],

	callback: function(r)
	{

		var L = require.toUrl('css');

		console.log([r, L, require.toUrl('order'), require.toUrl('requirejs')]);
	},
});