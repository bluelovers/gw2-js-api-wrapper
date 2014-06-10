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