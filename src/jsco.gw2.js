(function($)
{
	var unsafeWindow = unsafeWindow || window;

	var _gw2api = new GW2API;
	var _gw2 = new(function()
	{
		this._self = this;
	})();

	$.extend(
	{
		gw2: _gw2,
	});

	$.extend(_gw2, _gw2api, _gw2, {

		_defaults: {
			conf: {
				lang: 'en',
			},
		},

		_data: {
			conf: {
			},
		},

		_api: _gw2api,

		setOptions: function(options)
		{
			$.extend(this._data.conf, {
			}, options);
		},

		getOption: function(name)
		{
			if (name)
			{
				return this._data.conf[name];
			}
			else
			{
				return this._data.conf;
			}
		},

		/**
		 * http://wiki.guildwars2.com/index.php?title=MediaWiki:GameLinks.js
		 **/
		gamelink: function(type, id)
		{
			var typeId = '0';

			if (type.match(/(1|2|4|7|8|10)/))
			{
				typeId = String.fromCharCode(type);

				if (type == 2) typeId += String.fromCharCode(1);
			}
			else if ($.gw2.gamelink.typeid[type])
			{
				typeId = $.gw2.gamelink.typeid[type];
			}

			if (typeId)
			{
				id = BEtoLE(String.fromCharCode(parseInt(id)));

				var pad = String.fromCharCode(0) + String.fromCharCode(0);

				var chatLink = "[&" + Base64.encode(typeId + id + pad) + "]";

				return chatLink;
			}

			return false;
		},

		getMapTyriaNames: function(language)
		{
			var me;
			if (!language)
			{
				language = this.getOption('lang');
			}
			if (this.checkValidLanguage(language))
			{
				if (!this.mapTyriaNames)
				{
					me = this;
					$.ajax(
					{
						url: "http://gw2.chillerlan.net/json/gw2_maps.json",
						type: "get",
						dataType: "json",
						async: false,
					}).done(function(d)
					{
						for (var i in d)
						{
							d[i]['name'] = d[i]['name_' + language];
						}

						return me.mapTyriaNames = d;
					});
				}
				return this.mapTyriaNames;
			}
			return false;
		},
	});

	_gw2.setOptions(_gw2._defaults.conf);

	$.extend($.gw2.gamelink, {
		typeid: {
			item: String.fromCharCode(2) + String.fromCharCode(1),
			map: String.fromCharCode(4),
			skill: String.fromCharCode(7),
			trait: String.fromCharCode(8),
			recipe: String.fromCharCode(10),
		},
	});

	var Base64 =
	{
		// private property
		_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

		// public method for encoding
		encode: function(input)
		{
			var output = "";
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			var i = 0;

			while (i < input.length)
			{
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);

				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;

				if (isNaN(chr2))
				{
					enc3 = enc4 = 64;
				}
				else if (isNaN(chr3))
				{
					enc4 = 64;
				}

				output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
			}

			return output;
		}
	};

	function BEtoLE(be)
	{
		var le = String.fromCharCode(be.charCodeAt(0) & 255) + String.fromCharCode(be.charCodeAt(0) >> 8);
		return le;
	}

})(jQuery);