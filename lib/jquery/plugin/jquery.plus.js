(function($)
{

	$.fn.extend(
	{

		disable: function(bool)
		{
			if (bool === undefined)
			{
				var bool = true;
			}
			else
			{
				var bool = !! bool;
			}

			this.each(function()
			{
				this.disabled = bool;
			});

			return this;
		},

	});

})(jQuery);