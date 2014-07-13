(function()
{

	var ScriptPath = function()
	{
		this.pathParts = new Array();

		try
		{
			throw new Error();
		}
		catch (e)
		{
			//console.log([e]);

			var stackLines = e.stack.split('\n');
			var callerIndex = 0;
			for (var i in stackLines)
			{
				if (!stackLines[i].match(/(http[s]?|file):\/\//)) continue;
				callerIndex = Number(i) + 2;
				break;
			}
			this.pathParts = stackLines[callerIndex].match(/((http[s]?:\/\/.+|file:\/\/\/.+)\/([^\/]+\.js)):/);
		}

		this.fullPath = function()
		{
			if (ScriptPath.options.basePath)
			{
				return ScriptPath.stripUri(this.pathParts[1], ScriptPath.options.basePath);
			}

			return this.pathParts[1];
		};

		this.path = function()
		{
			if (ScriptPath.options.basePath)
			{
				return ScriptPath.stripUri(this.pathParts[2], ScriptPath.options.basePath, true);
			}

			return this.pathParts[2];
		};

		this.file = function()
		{
			return this.pathParts[3];
		};

		this.fileNoExt = function()
		{
			var parts = this.file().split('.');
			parts.length = parts.length != 1 ? parts.length - 1 : 1;
			return parts.join('.');
		};
	};

	ScriptPath.options = new Object;

	ScriptPath.stripUri = function(uri, base, bool)
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

			uri = uri.replace(/\/+$/ig, '') + (bool ? '/' : '');

			if (base && (base = ScriptPath.stripUri(base)))
			{
				if (uri.substring(0, base.length) === base)
				{
					uri = uri.substring(base.length);
				}
			}

			return uri;
		};

	var getScriptPath = function(options)
	{
		if (options)
		{
			for (var i in options)
			{
				ScriptPath.options[i] = options[i];
			}
		}

		return new ScriptPath();
	};

	return (require ? (require.register ? require.register('getScriptPath', getScriptPath) : getScriptPath) : window.getScriptPath = getScriptPath);

})();