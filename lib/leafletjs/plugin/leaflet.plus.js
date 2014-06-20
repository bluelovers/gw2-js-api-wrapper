L.Marker.include(
{

	show: function()
	{
		this._icon.style.display = '';
	},

	hide: function()
	{
		this._icon.style.display = 'none';
	},

	updateIconStyles: function(options)
	{
		if (options) this.options.icon.setOptions(options);

		this.options.icon._setIconStyles(this._icon, 'icon');

		return this;
	},

});

(function(_old)
{

	L.Marker.prototype._initIcon = function()
	{
		_old.call(this);

		//console.log(this.options);

		if (this.options.iconHoverUrl || this.options.icon.options.iconHoverUrl)
		{
			this.on('mouseover', function(e)
			{
				var _src

				if (_src = (this.options.iconHoverUrl || this.options.icon.options.iconHoverUrl))
				{
					this._icon.src = _src;
				}
			}).on('mouseout', function(e)
			{
				if ((this.options.iconHoverUrl || this.options.icon.options.iconHoverUrl) && this._icon.src != this.options.icon.options.iconUrl)
				{
					this._icon.src = this.options.icon.options.iconUrl;
				}
			});
		}

		if (this.options.hookZoomOutIn)
		{

		}
	};

})(L.Marker.prototype._initIcon);

L.Icon.include(
{

	setOptions: function(options)
	{
		options && L.setOptions(this, options);

		return this;
	},

});

L.Control.Layers.include(
{

	toggleOverlay: function(layer, bool)
	{
		var bool = !! (bool === undefined || bool);
		var id = L.stamp(layer);

		if (this._layers[id])
		{
			if (bool == !this._map.hasLayer(layer))
			{
				var i, input, obj, inputs = this._form.getElementsByTagName('input'),
					inputsLen = inputs.length;

				for (i = 0; i < inputsLen; i++)
				{
					input = inputs[i];

					if (input.layerId == id)
					{
						obj = this._layers[input.layerId];

						input.checked = bool;

						if (bool)
						{
							this._map.addLayer(obj.layer);
						}
						else
						{
							this._map.removeLayer(obj.layer);
						}
					}
				}
			}
		}

		return this;
	},

});