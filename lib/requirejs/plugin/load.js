(function()
{

	define(['propertyParser'], function(async, propertyParser)
	{
		return {
			load: function(name, req, load, config)
			{
				if (config.isBuild)
				{
					load(null); //avoid errors on the optimizer
				}
				else
				{
					console.log(this);

					var url = req.toUrl(name + '.css');

					var css = document.createElement('link');
					css.type = "text/css";
					css.rel = "stylesheet";
					css.href = url;

					var heads = document.getElementsByTagName('head');

					if (!heads || !heads.length)
					{
						heads = document.getElementsByTagName('html');
					}

					if (heads && heads.length > 0)
					{
						heads[0].appendChild(css);
						load(css);
					}
					else
					{
						load.error();
					}
				}
			}
		}
	});

})();