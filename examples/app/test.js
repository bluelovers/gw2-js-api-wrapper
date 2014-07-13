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

		console.log([a, r, L, require.toUrl('gw2api'), require.toUrl('order'), require.toUrl('requirejs'), require.toUrl('jquery'), require.s.contexts._.config]);

		require(['gw2api', 'scriptpath'], function(gw2api, scriptpath)
		{
			console.log([gw2api, gw2api.apiMap._.alias]);

			console.log(gw2api.get('maps', 15));
			console.log(gw2api.get('maps', 16));

			console.log([gw2api.Cache, scriptpath()]);

			var a;


			console.log([a = gw2api.get('chat/link/encode', 'item', 49532, 260), gw2api.ChatLink.decode(a), gw2api.ChatLink.decode('&AvtgTAAA')]);

			console.log([gw2api.ChatLink(), gw2api()]);


			console.log([require(['gw2api']), require('gw2api')]);
		});

		require(['jquery']);


		var stripUri = function(uri, base)
		{
			if (!uri) return uri;

			while (uri.match(/\/[^\/]+\/..(?:\/|$)/))
			{
				uri = uri.replace(/\/[^\/]+\/..(\/|$)/ig, '$1');
			}

			while (uri.match(/\/{2,}|\/.\//ig))
			{
				uri = uri.replace(/\/{2,}|\/.\//ig, '/');
			}

			uri = uri.replace(/\/+$/ig, '') + '/';

			if (base && (base = stripUri(base)))
			{
				if (uri.substring(0, base.length) === base)
				{
					uri = uri.substring(base.length);
				}
			}

			return uri;
		};

		require(['scriptpath'], function(scriptpath)
		{
			var a = getScriptPath(
			{
				basePath: require.s.head.baseURI.replace(/(\/)[^\/]+$/, '$1') + require.s.contexts._.config.baseUrl,
			});

			console.log([scriptpath, a, a.fullPath()]);
		});

		console.log([require, require.s, stripUri(require.s.head.baseURI.replace(/(\/)[^\/]+$/, '$1') + require.s.contexts._.config.baseUrl, 'file:/D:/Users/Documents/The%20Project/gw2-js-api-wrapper/')]);
	},
});