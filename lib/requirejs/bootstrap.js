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

	if (typeof requirejs.config2 === 'undefined')
	{
		requirejs.config2 = function(deps, callback, errback, optional)
		{
			if (!isArray(deps) && typeof deps !== 'string' && deps.paths)
			{
				(function(subpaths, paths)
				{
					var _scriptpath;

					for (var i in subpaths)
					{
						var a = subpaths[i].split('/'), t;

						if (a.length <= 1 || a === '@' || a[0].charAt(0) !== '@') continue;

						if (a[0] === '@.' || a[0] === '@..')
						{
							if (!_scriptpath)
							{
								_scriptpath = getScriptPath().path();
							}

							a[0] = _scriptpath + a[0].replace('@', '/');
						}
						else if ((t = a[0].replace('@', '')) && paths[t])
						{
							a[0] = paths[t];
						}
						else
						{
							continue;
						}

						subpaths[i] = a.join('/');
					}

					//console.log([subpaths]);
				})(deps.paths, requirejs.s.contexts._.config.paths);
			}

			return requirejs.config(deps, callback, errback, optional);
		};
	}

	if (typeof requirejs.reqeach === 'undefined')
	{
		requirejs.reqeach = function(deps, callback, errback, optional)
		{
			if (isArray(deps) && deps.length > 1)
			{
				for (var i in deps)
				{
					requirejs(deps[i]);
				}
			}

			return requirejs(deps, callback, errback, optional);;
		};
	}

})(requirejs);

requirejs.config2(
{
	paths: {
		'css': '@./plugin/css',
		'order': '@./plugin/order',
		'text': '@./plugin/text',

		'load': '@./plugin/load',
	},
});