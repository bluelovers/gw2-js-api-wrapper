define(['order!jquery', 'order!jquery.base64'], function($)
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
				this._initHooks[i].apply(this, arguments);
			}
		},
	});

	var O = $.extend(new Function, C);

	$.extend(O, {

		_data: {
			lang: 'en',

			_deflang: 'en',

			_langs: {
				en: 'en',
				es: 'es',
				de: 'de',
				fr: 'fr',
				ko: 'ko',
				zh: 'zh',
			},

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

			if (apimap.callFn)
			{
				ret = apimap.callFn.call(this, args, url, apimap);
			}
			else
			{
				data = O.fn.args(apimap.args, args);

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

		lang: function(lang)
		{
			if (lang)
			{
				this._data.lang = O.fn.lang(lang);
			}

			return this._data.lang;
		},

		get: function(name, key, lang)
		{
			var _this = this;

			var args = Array.prototype.slice.call(arguments, 1);

			var ret;
			var iskey = false;
			var fn;

			var lang = this.lang(lang);

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
					//var args = Array.prototype.slice.call(arguments, 1);

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

			ret = apimap.getCacheFn ? apimap.getCacheFn.call(this, lang, apiname, iskey, args) : O.Cache.get(lang, apiname);

			if (!ret)
			{
				ret = (function(ret)
				{
					if (apimap.source)
					{

					}
					else if (apimap.wrapFn)
					{
						ret = apimap.wrapFn.call(_this, ret);
					}
					else if (ret)
					{
						ret = O.fn.unwrap.call(_this, ret);
					}

					return ret;
				})(this.api(apiname, apimap.getArgs ? args : null));

				if (fn = O.fn.mapExists(this._data.handler, this._data.handler_alias, apiname))
				{
					ret = fn.call(this, ret);
				}

				if (!apimap.nocache)
				{
					if (apimap.setCacheFn)
					{
						apimap.setCacheFn.call(this, lang, apiname, ret, iskey, args);
					}
					else
					{
						O.Cache.set(lang, apiname, ret);
					}
				}
			}

			//console.log([key, ret]);

			if (iskey)
			{
				return apimap.keyFn ? apimap.keyFn.call(this, ret, key) : ret[key];
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

		add: function(apiname, data, update)
		{
			O.fn.mapAlias(O.apiMap, O.apiMap._.alias, apiname, data || new Object);

			if (update) this.update_api();

			return this;
		},

		update_api: function()
		{
			O.fn._apiupdate();

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
		},

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
				name = apiname[0];
			}
			else
			{
				name = apiname;
				var apiname = [apiname];
			}

			for (var i in apiname)
			{
				if (name != apiname[i]) O._data.alias[apiname[i]] = name;

				alias[apiname[i]] = alias[O.fn.camelCase(apiname[i])] = alias[O.fn.camelCase('get-' + apiname[i])] = name;
			}

			if (arguments.length == 4)
			{
				map[name] = value;
			}
		},

		mapExists: function(map, alias, apiname)
		{
			//console.log([map, alias, apiname]);

			if (apiname = alias[apiname])
			{
				return map[apiname];
			}

			return;
		},

		args: function(map, args)
		{
			data = new Object;

			if (map)
			{
				var args = args || new Array();

				for (var i in map)
				{
					switch (map[i])
					{
					case 'lang':
						data[(map[i])] = O.lang(args[i]);
						break;
					default:
						if (args[i]) data[(map[i])] = args[i];
						break;
					}
				}
			}
			else if (args)
			{
				data = args;
			}

			return data;
		},

		lang: function(lang)
		{
			lang = O._data._langs[lang] ? O._data._langs[lang] : (O._data.lang ? O._data.lang : O._data._deflang);

			return lang;
		},

		_apiupdate: function()
		{
			var map = O.apiMap._.alias = O.apiMap._.alias || new Object;

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
		},

		unwrap: function(ret)
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
		},

		wrapIdName: function(ret, key)
		{
			var data = new Object;
			var key = key || 'id';

			for (var i in ret)
			{
				data[ret[i][key]] = ret[i];
			}

			return data;
		},

		wrapKey: function(ret, key, unwrap)
		{
			var data = ret || new Object;

			if (unwrap)
			{
				data = O.fn.unwrap(data);
			}

			for (var i in data)
			{
				data[i][key] = i;
			}

			return data;
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

			nocache: true,
			getArgs: true,
			nokey: true,
		},

		event_names: {
			//api: 'https://api.guildwars2.com/v1/event_names.json',
			args: [
				'lang',
				],

			wrapFn: O.fn.wrapIdName,
		},

		map_names: {
			args: [
				'lang',
				],

			wrapFn: O.fn.wrapIdName,
		},

		world_names: {
			args: [
				'lang',
				],

			wrapFn: O.fn.wrapIdName,
		},

		event_details: {
			args: [
				'event_id',
				'lang',
				],

			wrapFn: function(ret)
			{
				return O.fn.wrapKey.call(this, ret, 'event_id', true);
			},
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

			source: true,
		},

		recipes: {
		},

		recipe_details: {
			args: [
				'recipe_id',
				'lang',
				],

			source: true,
		},

		skins: {
		},

		skin_details: {
			args: [
				'skin_id',
				'lang',
				],

			source: true,
		},

		// Map information

		continents: {
		},

		maps: {
			args: [
				'map_id',
				'lang',
				],

			wrapFn: function(ret)
			{
				return O.fn.wrapKey.call(this, ret, 'map_id', true);
			},
		},

		map_floor: {
			args: [
				'continent_id',
				'lang',
				],

			nocache: true,
			getArgs: true,
			nokey: true,
		},

		// World vs. World

		'wvw/matches': {
			wrapFn: function(ret)
			{
				return O.fn.wrapIdName(ret, 'wvw_match_id');
			},
		},

		'wvw/match_details': {
			args: [
				'match_id',
				],

			source: true,
		},

		'wvw/objective_names': {
			args: [
				'lang',
				],

			wrapFn: O.fn.wrapIdName,
		},

		// Miscellaneous

		build: {
		},

		colors: {
			args: [
				'lang',
				],

			wrapFn: function(ret)
			{
				return O.fn.wrapKey.call(this, ret, 'color_id', true);
			},
		},

		files: {
			alias: ['assets'],
		},

	});

	O.Cache = $.extend(new Function, C, {

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
			lang = O.fn.lang(lang);

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

	/**
	 * http://wiki.guildwars2.com/wiki/Template:Game_link
	 **/
	O.ChatLink = $.extend(new Function, C, {

		/**
		 * http://wiki.guildwars2.com/wiki/Chat_link_format
		 **/
		typeid: {
			item: 2,
			map: 4,
			skill: 7,
			trait: 8,
			recipe: 10,
			skin: 11,
			outfit: 12,

			coin: 1,
			text: 3,
		},

		init: function()
		{
			var data = new Object;

			for (var i in this.typeid)
			{
				data[this.typeid[i]] = i;
			}

			this.type = data;
		},

		encode: function(type, id, num)
		{
			if (isNaN(id))
			{
				return 'invalid id';
			}

			var type = this.typeid[String.prototype.trim.call(type).toLowerCase()] || (String.prototype.match.call(type, /^\d+$/) ? type : 0);

			if (!type)
			{
				return 'invalid type';
			}

			var data = [];
			while (id > 0)
			{
				i2 = id + 0;

				data.push(i3 = id & 255);
				id = id >> 8;

				//console.log([i2, i3, id]);
			}
			while (data.length < 4 || data.length % 2 != 0)
			{
				data.push(0);
			}

			if (type == 2)
			{
				data.unshift(num || 1);
			}
			data.unshift(type);

			// encode data
			var binary = '';
			for (var i = 0; i < data.length; i++)
			{
				binary += String.fromCharCode(data[i]);
			}

			//console.log([data, binary]);

			return '[&' + $.base64.encode(binary) + ']';
		},

		decode: function(text)
		{
			if (!text)
			{
				return;
			}

			var data = String.prototype.replace.call(text, /^\[\&|\]$/, '');

			data = $.base64.decode(data);

			var binary = [];

			for (var i = 0; i < data.length; i++)
			{
				binary[i] = data.charCodeAt(i);
			}

			var ret = new Object;

			i = 0;

			ret.typeid = binary[i++];
			ret.type = this.type[ret.typeid] || ('UNKNOW #' + ret.typeid);

			if (ret.typeid == 2)
			{
				ret.num = binary[i++];
			}

			ret.id = binary[i++];
			ret.id += binary[i++] << 8;

			ret.source = text + '';
			ret.binary = binary;

			//console.log([data.length, ret, binary, binary2]);

			return ret;
		},

	});

	C.call(O.ChatLink);

	O.fn._apiupdate();

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
	}).on(['map/tile/url', 'tile/url'], function(continentID, floorID, z, x, y, s)
	{
		return 'https://tiles' + (s ? s : '') + '.guildwars2.com/' + continentID + '/' + floorID + '/' + z + '/' + x + '/' + y + '.jpg';
	}).on(['chat/link/encode', 'chat/link'], function(type, id, num)
	{
		return O.ChatLink.encode.apply(O.ChatLink, arguments);
	}).on(['chat/link/decode'], function(text)
	{
		return O.ChatLink.decode.apply(O.ChatLink, arguments);
	});

	O.update();

	return require.register('gw2api', O);

});