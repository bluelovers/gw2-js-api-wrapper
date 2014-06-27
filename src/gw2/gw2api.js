define(['jquery'], function($)
{

	function isArray(it)
	{
		return Object.prototype.toString.call(it) === '[object Array]';
	}

	var C = function()
	{
		if (this.init)
		{
			this.init.apply(this, arguments);
		}

		// call all constructor hooks
		if (this._initHooks.length)
		{
			this.callInitHooks.apply(this, arguments);
		}

		return this;
	};

	$.extend(C, {
		_initHooks: [],

		callInitHooks: function()
		{
			if (this._initHooksCalled)
			{
				return;
			}

			this._initHooksCalled = true;

			for (var i in this._initHooks.length)
			{
				this._initHooks[i].call(this, arguments);
			}
		},
	});

	var O = $.extend(new Function, C);

	$.extend(O, {

		_data: {
			lang: 'en',

			handler: {
			},

			handler_alias: {
			},

			alias: {
			},
		},

		api: function(apiname, args)
		{
			var ret, data;

			var apiname = O.apiMap._.alias[apiname];

			var apimap = O.apiMap[apiname];

			var url = O.fn.tpl(apimap.api || O.apiMap._.server[O.apiMap._.serverid], {
				apiname: apiname,
			});

			if (!apimap.callFn && apimap.args && args)
			{
				data = new Object;

				if (isArray(args))
				{
					for (var i in args)
					{
						if (args[i]) data[(apimap.args[i])] = args[i];
					}
				}
				else
				{
					data = args;
				}
			}

			if (apimap.callFn)
			{
				ret = apimap.callFn.call(this, args, url, apimap);
			}
			else
			{
				$.ajax(
				{
					url: url,
					type: 'get',
					dataType: 'json',
					async: false,
					data: data,
				}).done(function(d)
				{
					return ret = d;
				});
			}

			return ret;
		},

		get: function(name, key, lang)
		{
			var ret;
			var iskey = false;
			var fn;

			var lang = lang || this._data.lang;

			var apiname = O.apiMap._.alias[name];

			if (!apiname && (apiname = O.apiMap._.alias[name + 's']))
			{
				iskey = true;
			}

			if (!apiname)
			{
				apiname = name;

				if (fn = O.fn.mapExists(this._data.handler, this._data.handler_alias, apiname))
				{
					var args = Array.prototype.slice.call(arguments, 1);

					return fn.apply(this, args);
				}

				return;
			}

			var apimap = O.apiMap[apiname];

			if (apimap.nokey)
			{
				iskey = false;
			}
			else if (key)
			{
				iskey = true;
			}

			ret = O.Cache.get(lang, apiname);

			if (!ret)
			{
				ret = (function(ret)
				{
					if (!apimap.source && ret)
					{
						var i, i2;

						for (i in ret)
						{
							if (i2 === undefined)
							{
								i2 = i;
							}
							else
							{
								return ret;
							}
						}

						if (i2 === i)
						{
							return ret[i2];
						}
					}

					return ret;
				})(this.api(apiname, apimap.getArgs ? Array.prototype.slice.call(arguments, 1) : null));

				if (fn = O.fn.mapExists(this._data.handler, this._data.handler_alias, apiname))
				{
					ret = fn.call(this, ret);
				}

				if (!apimap.nocache)
				{
					O.Cache.set(lang, apiname, ret);
				}
			}

			//console.log([key, ret]);

			if (iskey)
			{
				return ret[key];
			}
			else
			{
				return ret;
			}
		},

		on: function(apiname, fn)
		{
			O.fn.mapAlias(this._data.handler, this._data.handler_alias, apiname, fn);

			return this;
		},

		off: function(apiname)
		{
			delete this._data.handler[(O.apiMap._.alias[apiname] || apiname)];

			return this;
		},

		add: function(apiname, data)
		{
			O.fn.mapAlias(O.apiMap, O.apiMap._.alias, apiname, data || new Object);

			return this;
		},

		update: function()
		{
			var _loop = function(map)
			{
				var data = new Object;
				var i, camel;

				for (i in map)
				{
					if (i == '_') continue;

					camel = O.fn.camelCase('get-' + i);

					if (!O.prototype[camel] && !O[camel])
					{
						data[camel] = (function(i)
						{
							return function()
							{
								var args = Array.prototype.slice.call(arguments);

								//console.log([args]);

								args.unshift(i);

								//console.log([args]);

								return O.get.apply(O, args);
							};
						})(i);
					}
				}

				$.extend(O, data);
			};

			_loop(O.apiMap);
			_loop(this._data.handler);

			var i, camel, j;
			var data = new Object;

			for (var i in O._data.alias)
			{
				camel = O.fn.camelCase('get-' + i);

				if (!O.prototype[camel] && !O[camel])
				{
					data[camel] = (function(i)
					{
						return function()
						{
							var args = Array.prototype.slice.call(arguments);

							//console.log([args]);

							args.unshift(i);

							//console.log([args]);

							return O.get.apply(O, args);
						};
					})(O._data.alias[i]);
				}
			}

			$.extend(O, data);

			return this;
		}

	});

	O.fn = $.extend(new Object, {

		camelCase: function(string)
		{
			return $.camelCase(string.replace(/[_\/]/g, '-'));
		},

		tpl: function(text, data)
		{
			var text = text + '';

			for (var i in data)
			{
				text = text.replace('{@' + i + '}', data[i]);
			}

			return text;
		},

		mapAlias: function(map, alias, apiname, value)
		{
			var name;

			if (isArray(apiname))
			{
				//console.log([apiname]);

				name = apiname[0];
				apiname = apiname[1];

				//console.log([name, apiname]);

				O._data.alias[apiname] = name;
			}

			alias[apiname] = alias[O.fn.camelCase(apiname)] = alias[O.fn.camelCase('get-' + apiname)] = name || apiname;

			if (arguments.length == 4)
			{
				map[(name || apiname)] = value;
			}
		},

		mapExists: function(map, alias, apiname)
		{
			if (apiname = alias[apiname])
			{
				return map[apiname];
			}

			return;
		},

		args: function(map, args)
		{
			data = new Object;

			if (map && args)
			{
				if (isArray(args))
				{
					for (var i in args)
					{
						if (args[i]) data[(map[i])] = args[i];
					}
				}
				else
				{
					data = args;
				}
			}

			return data;
		}

	});

	O.apiMap = $.extend(new Object, {

		'_': {
			serverid: 0,
			server: [
				'https://api.guildwars2.com/v1/{@apiname}.json',
				],
		},

		// Dynamic events

		events: {
			//api: 'https://api.guildwars2.com/v1/events.json',
			args: [
				'world_id',
				'map_id',
				'event_id',
				],
		},

		event_names: {
			//api: 'https://api.guildwars2.com/v1/event_names.json',
			args: [
				'lang',
				],
		},

		map_names: {
			args: [
				'lang',
				],
		},

		world_names: {
			args: [
				'lang',
				],
		},

		event_details: {
			args: [
				'event_id',
				'lang',
				],
		},

		// Guilds

		guild_details: {
			args: [
				'guild_id',
				'guild_name',
				],

			nocache: true,
			getArgs: true,
			nokey: true,
			source: true,
		},

		// Items

		items: {
		},

		item_details: {
			args: [
				'item_id',
				'lang',
				],
		},

		recipes: {
		},

		recipe_details: {
			args: [
				'recipe_id',
				'lang',
				],
		},

		skins: {
		},

		skin_details: {
			args: [
				'skin_id',
				'lang',
				],
		},

		// Map information

		continents: {
		},

		maps: {
			args: [
				'map_id',
				'lang',
				],
		},

		map_floor: {
			args: [
				'continent_id',
				'lang',
				],
		},

		// World vs. World

		'wvw/matches': {
		},

		'wvw/match_details': {
			args: [
				'match_id',
				],
		},

		'wvw/objective_names': {
			args: [
				'lang',
				],
		},

		// Miscellaneous

		build: {
		},

		colors: {
			args: [
				'lang',
				],
		},

		files: {
			alias: ['assets'],
		},

	});

	O.Cache = $.extend(new Function, C, {

		_deflang: 'en',

		_langs: {
			en: 'en',
			es: 'es',
			de: 'de',
			fr: 'fr',
			ko: 'ko',
			zh: 'zh',
		},

		_cache: {

		},

		get: function(lang, key)
		{
			return this._get(lang, key);
		},

		set: function(lang, key, value)
		{
			return this._cache[this.lang(lang)][key] = value;
		},

		_get: function(lang, key)
		{
			return this._cache[this.lang(lang)][key];
		},

		lang: function(lang)
		{
			lang = this._langs[lang] ? this._langs[lang] : this._deflang;

			if (typeof this._cache[lang] === 'undefined')
			{
				this._cache[lang] = new Object;
			}

			return lang;
		},

		unset: function(lang, key)
		{
			delete this._cache[lang][key];
		},

	});

	O.apiMap._.alias = (function()
	{
		var map = new Object;

		for (var i in O.apiMap)
		{
			if (i == '_') continue;

			O.fn.mapAlias(null, map, i);

			if (O.apiMap[i].alias)
			{
				for (var j in O.apiMap[i].alias)
				{
					//console.log([i, O.apiMap[i].alias[j]]);

					O.fn.mapAlias(null, map, [i, O.apiMap[i].alias[j]]);
				}
			}

			//map[i] = map[O.fn.camelCase(i)] = map[O.fn.camelCase('get-' + i)] = i;
		}

		return map;
	})();

	O.on(['asset/url', 'file/url'], function(signature, id, format)
	{
		if ((signature && !id) || (!signature && id))
		{
			var signature = O.get('getAsset', signature || id);
			var id = null;
		}

		if ($.isPlainObject(signature))
		{
			var id = signature.file_id;
			var signature = signature.signature;
		}

		if (!signature || !id) return;

		if (format == null)
		{
			format = 'png';
		}

		if (['png', 'jpg'].indexOf(format) > -1)
		{
			return 'https://render.guildwars2.com/file/' + signature + '/' + id + '.' + format;
		}

		return false;
	}).on('map/tile/url', function(continentID, floorID, z, x, y, s)
	{
		return 'https://tiles' + (s ? s : '') + '.guildwars2.com/' + continentID + '/' + floorID + '/' + z + '/' + x + '/' + y + '.jpg';
	});

	O.update();

	return require.register('gw2api', O);

});