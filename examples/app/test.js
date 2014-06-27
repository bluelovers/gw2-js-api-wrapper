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
				console.log([gw2api]);

				var i;

				for (i in gw2api.apiMap)
				{
					if (i != '_')
					{
						console.log(gw2api.fn.camelCase(i));
					}
				}
			});
		},
	});
});