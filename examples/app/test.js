requirejs.config(
{
	'baseUrl': '..',
});

require(['examples/bootstrap'], function(r)
{
	requirejs.config(
	{
		paths: {
			'gw2api': 'src/gw2/gw2api',
		},

		//deps: ['lib/requirejs/bootstrap'],

		callback: function(r)
		{
			var a = require([]);

			var L = require.toUrl('css');

			console.log([r, L, require.toUrl('gw2api'), require.toUrl('order'), require.toUrl('requirejs'), require.toUrl('jquery'), require.s.contexts._.config.paths]);

			require(['gw2api'], function(gw2api)
			{
				console.log([gw2api, gw2api.apiMap._.alias]);

				console.log(gw2api.get('maps', 15));
				console.log(gw2api.get('maps', 16));

				console.log([gw2api.Cache]);
			});
		},
	});
});