(function($)
{
	var matcher = /\s*(?:((?:(?:\\\.|[^=.,])+\.?)+)\s*([!~><=]=|[><=])\s*("|')?((?:\\\3|.)*?)\3|(.+?))\s*(?:,|$)/g;

	function operator(elem, name, operator, check)
	{
		var result = elem.data(name);

		if (result == null)
		{
			return operator === "!=";
		}
		if (!operator)
		{
			return true;
		}

		result += "";

		return (operator === "=" || operator === "==") ? result === check : operator === "!=" ? result !== check : operator === "^=" ? check && result.indexOf(check) === 0 : operator === "*=" ? check && result.indexOf(check) > -1 : operator === "$=" ? check && result.slice(-check.length) === check : operator === "~=" ? (" " + result + " ").indexOf(check) > -1 : operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" : false;
	}

	jQuery.expr[':'].data = function(el, i, match)
	{
		var _this = $(el),
			v, m;

		matcher.lastIndex = 0;

		if (match[3])
		{
			var m = matcher.exec(match[3]);

			if (m[5])
			{
				v = !! _this.data(m[5]);
			}
			else
			{
				v = operator(_this, m[1], m[2], m[4]);
			}

			return v;
		}

	};
})(jQuery);