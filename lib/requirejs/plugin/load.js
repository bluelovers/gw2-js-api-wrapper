define(['propertyParser', 'jquery', 'jquery.selector.data'], function(propertyParser, $)
{
	'use strict';

	var testScript = typeof document !== "undefined" && typeof window !== "undefined" && document.createElement("script"),

		supportsInOrderExecution = testScript && (testScript.async || ((window.opera && Object.prototype.toString.call(window.opera) === "[object Opera]") ||
		//If Firefox 2 does not have to be supported, then
		//a better check may be:
		//('mozIsLocallyAvailable' in window.navigator)
		("MozAppearance" in document.documentElement.style))),

		//This test is true for IE browsers, which will load scripts but only
		//execute them once the script is added to the DOM.
		supportsLoadSeparateFromExecute = testScript && testScript.readyState === 'uninitialized';

	var objClass =
	{
		'default': {
			defModel: 'css',
		},

		'options': {
		},

		init: function(options)
		{
			var _options = $.extend(
			{
			}, objClass.
		default, options);

			if (!_options.headElement)
			{
				$(['head', 'html', 'body']).each(function(i, v)
				{
					var _this = $(v);

					//console.log(_this.get(0).tagName);

					if (!_options.headElement && _this.size())
					{
						_options.headElement = _this.eq(0);
					}
				});
			}

			if (!_options.baseElement)
			{
				var style = _options.headElement.find('style, base');

				if (style.size())
				{
					_options.baseElement = style.eq(0);
				}
			}

			objClass.config(_options);

			return objClass;
		},

		config: function(options)
		{
			$.extend(objClass.options, {
			}, options);

			return objClass;
		},

		rParts: /^([^,]+),([^\|]+)\|?/,

		parseName: function(name)
		{
			var data =
			{
			},
				vendors = name.split('|'),
				n = vendors.length,
				match;

			while (n--)
			{
				var name = vendors[n];

				if (match = objClass.rParts.exec(name))
				{
					if (n == 0)
					{
						name = match[1];
					}

					data[name] = propertyParser.parseProperties(match[2]);
				}

				if (n == 0 && !data['name'])
				{
					data['name'] = name;
				}
			}
			return data;
		},

		parseData: function(data)
		{
			if (typeof data === 'string')
			{
				data = objClass.parseName(data);
			}

			if (!data.href)
			{
				data.href = data.name;
			}

			return data;
		},

		createNode: function(elem, data)
		{
			var _data =
			{
				requirecontext: '_',
				requiremodule: data.name,
			};

			var _data2attr =
			{
			};

			for (var i in _data)
			{
				_data2attr['data-' + i] = _data[i];
			}

			return $(elem).attr(
			{
				charset: 'utf-8',
				async: true,
			}).data(_data).attr(_data2attr);
		},

		load: function(name, req, load, config)
		{
			//console.log([arguments]);
			if (config.isBuild)
			{
				load(null); //avoid errors on the optimizer
			}
			else
			{
				var data = objClass.parseData(name),
					settings = data.settings;

				//console.log(objClass.parseData('google,families:[Tangerine,Cantarell]'));
				//console.log([objClass, data]);

				var _callback = function()
				{
					var url = req.toUrl(data.href + (data.noext ? '' : '.css'));

					var elem = objClass.createNode($('<link/>').attr(
					{
						type: "text/css",
						rel: "stylesheet",
						href: url,
					}), data);

					if (objClass.options.baseElement)
					{
						objClass.options.baseElement.before(elem);
						load(elem.get(0));
					}
					else if (objClass.options.headElement)
					{
						objClass.options.headElement.append(elem);
						load(elem.get(0));
					}
					else
					{
						load.error();
					}
				};

				//console.log([url, data]);
				if (config.shim[data.href] && config.shim[data.href].deps)
				{
					req(config.shim[data.href].deps || [], _callback);
				}
				else
				{
					_callback();
				}
			}

			return objClass;
		},
	};

	return objClass.init();
});