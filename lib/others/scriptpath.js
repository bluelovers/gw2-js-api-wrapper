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
			console.log([e]);


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
			return this.pathParts[1];
		};

		this.path = function()
		{
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

	var getScriptPath = function()
	{
		return new ScriptPath();
	};

	return (require ? (require.register ? require.register('getScriptPath', getScriptPath) : getScriptPath) : window.getScriptPath = getScriptPath);

})();