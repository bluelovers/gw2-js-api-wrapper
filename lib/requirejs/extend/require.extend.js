(function(require)
{
	function isArray(it)
	{
		return Object.prototype.toString.call(it) === '[object Array]';
	}

	function ScriptPath()
	{
		var pathParts;

		var scriptPath = '';
		try
		{
			throw new Error();
		}
		catch (e)
		{
			var stackLines = e.stack.split('\n');
			var callerIndex = 0;
			for (var i in stackLines)
			{
				if (!stackLines[i].match(/(http[s]?|file):\/\//)) continue;
				callerIndex = Number(i) + 2;
				break;
			}
			pathParts = stackLines[callerIndex].match(/((http[s]?:\/\/.+|file:\/\/\/.+)\/([^\/]+\.js)):/);
		}

		this.fullPath = function()
		{
			return pathParts[1];
		};

		this.path = function()
		{
			return pathParts[2];
		};

		this.file = function()
		{
			return pathParts[3];
		};

		this.fileNoExt = function()
		{
			var parts = this.file().split('.');
			parts.length = parts.length != 1 ? parts.length - 1 : 1;
			return parts.join('.');
		};
	}

	var getScriptPath = window.getScriptPath = function()
	{
		return new ScriptPath();
	};

	if (typeof require.config2 === 'undefined')
	{

		var _getscriptpath = function(_scriptpath, a)
		{
			if (typeof _scriptpath === 'undefined')
			{
				_scriptpath = getScriptPath().path();
			}

			if (a === '@.' || a === '@..')
			{
				a = _scriptpath + a.replace('@', '/');
			}

			return a;
		}

		require.config2 = function(deps, callback, errback, optional)
		{
			if (!isArray(deps) && typeof deps !== 'string')
			{
				var _scriptpath;

				//_scriptpath = getScriptPath().path();

				if (deps.baseUrl)
				{
					//console.log([deps.baseUrl, ]);
					deps.baseUrl = _getscriptpath(_scriptpath, deps.baseUrl);
					//console.log([deps.baseUrl]);
				}

				if (deps.paths)
				{
					(function(subpaths, paths)
					{
						var _paths = new Object;

						for (var i in subpaths)
						{
							var a = subpaths[i].split('/'),
								t;

							if (a[0].charAt(0) !== '@' || a === '@') continue;

							if (a[0] === '@.' || a[0] === '@..')
							{
								/**
								 if (!_scriptpath)
								 {
								 _scriptpath = getScriptPath().path();
								 }

								 a[0] = _scriptpath + a[0].replace('@', '/');
								 **/

								a[0] = _getscriptpath(_scriptpath, a[0]);
							}
							else if ((t = a[0].replace('@', '')) && (paths[t] || _paths[t]))
							{
								a[0] = paths[t] || _paths[t];
							}
							else
							{
								continue;
							}

							_paths[i] = subpaths[i] = a.join('/');
						}

						//console.log([subpaths]);
					})(deps.paths, require.s.contexts._.config.paths);
				}
			}

			return require.config(deps, callback, errback, optional);
		};
	}

	if (typeof require.reqeach === 'undefined')
	{
		require.reqeach = function(deps, callback, errback, optional)
		{
			if (isArray(deps) && deps.length > 1)
			{
				for (var i in deps)
				{
					require([deps[i]]);
				}
			}

			return require(deps, callback, errback, optional);;
		};
	}

	if (typeof require.reqwith === 'undefined')
	{
		require.reqwith = function(updeps, deps, callback)
		{
			return require.reqeach(updeps, function()
			{
				return require(deps, callback);
			});
		};
	}

	require.register = function(name, obj)
	{
		(function()
		{
			if (typeof module === 'object' && typeof module.exports === 'object')
			{
				module.exports = obj;
			}
			else if (typeof define === 'function' && define.amd)
			{
				//console.log(['define', name, obj]);

				define(name, [], function()
				{
					return obj;
				});
			}
		})();

		(function(_old)
		{
			if (obj.noConflict === undefined)
			{
				obj.noConflict = function()
				{
					window[name] = _old;
					return this;
				};
			}

			window[name] = obj;
		})(window[name]);

		return obj;
	};

	return require;

})(requirejs);