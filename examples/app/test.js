requirejs.config(
{
	'baseUrl': '..',

	paths: {
		'gw2api': 'src/gw2/gw2api',
	},

	deps: ['examples/bootstrap'],

	callback: function(r)
	{
		var a = require([]);

		var L = require.toUrl('css');

		console.log([a, r, L, require.toUrl('gw2api'), require.toUrl('order'), require.toUrl('requirejs'), require.toUrl('jquery'), require.s.contexts._.config.paths]);

		require(['gw2api', 'scriptpath'], function(gw2api, scriptpath)
		{
			console.log([gw2api, gw2api.apiMap._.alias]);

			console.log(gw2api.get('maps', 15));
			console.log(gw2api.get('maps', 16));

			console.log([gw2api.Cache, scriptpath()]);
		});
	},
});