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
		},

		api: function(apiname, args)
		{
			var ret, data = new Object;

			var apiname = O.apiMap._.alias[apiname];

			var apimap = O.apiMap[apiname];

			var url = apimap.api || (O.apiMap._.server[O.apiMap._.serverid] + '').replace('{@apiname}', apiname);

			if (apimap.args && args)
			{
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

			return ret;
		},

		get: function(name, key, lang)
		{
			var iskey = false;

			var lang = lang || this._data.lang;

			var apiname = O.apiMap._.alias[name];

			if (!apiname && (apiname = O.apiMap._.alias[name + 's']))
			{
				iskey = true;
			}

			if (!apiname)
			{
				return;
			}

			if (key)
			{
				iskey = true;
			}

			var ret = O.Cache.get(lang, apiname);

			if (!ret)
			{
				ret = (function(ret)
				{
					if (ret)
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
				})(this.api(apiname));

				if (this._data.handler && this._data.handler[apiname])
				{
					ret = this._data.handler[apiname].call(this, ret);
				}

				O.Cache.set(lang, apiname, ret);
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
			this._data.handler[(O.apiMap._.alias[apiname] || apiname)] = fn;

			return this;
		}

	});

	O.fn = $.extend(new Object, {

		camelCase: function(string)
		{
			return $.camelCase(string.replace(/[_\/]/g, '-'));
		},

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
		},

	});

	O.apiMap._.alias = (function()
	{
		var map = new Object;

		for (var i in O.apiMap)
		{
			if (i == '_') continue;

			map[i] = map[O.fn.camelCase(i)] = map[O.fn.camelCase('get-' + i)] = i;
		}

		return map;
	})();

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

	return require.register('gw2api', O);

});