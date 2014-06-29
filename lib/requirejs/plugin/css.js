/**
 * RequireJS Plugin - CSS Loader
 *
 * [ex.]
 *   define(['css!jquery-ui-css', 'jquery', 'jquery-ui'], { });
 *
 * Its better to put 'css!' in front of other js dependencies to get
 * faster loading speed
 *
 * @source http://leftmore.blogspot.tw/2012/07/requirejs-plugin-css-loader.html
 * @source https://gist.github.com/louisje/3102735
 *
 */

;
(function()
{

	define(
	{
		load: function(name, req, load, config)
		{
			var url = req.toUrl(name + '.css');
			var css = document.createElement('link');
			css.type = "text/css";
			css.rel = "stylesheet";
			css.href = url;
			var heads = document.getElementsByTagName('head')
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
	});

})();