(function($)
{
	'use strict';

	var unsafeWindow = unsafeWindow || window;

	var layerInit = (function()
	{
		// http://leafletjs.com/reference.html#url-template

		var continents = $.gw2.getContinents();

		var _layer =
		{
		},
			_layerids = [],
			floor = 1;

		var _default =
		{
			tyria: {
				center: [16605, 15452],
				zoom: 7,
			},

			mists: {
				center: [2620, 2629],
				zoom: 3,
			},
		};

		for (var i in continents)
		{
			var data = continents[i];

			var name = data.name.toLowerCase();

			_layerids[i] = _layerids[name] = name;

			_layer[name] = $.extend(true, _default[name], {
			}, {
				// https://tiles.guildwars2.com/1/1/{z}/{x}/{y}.jpg
				_tileuri: $.gw2.getTileURL(i, floor, '{z}', '{x}', '{y}', '{s}'),
				_size: data.continent_dims,

				_data: data,

				_name: data.name,

				minZoom: data.min_zoom,
				maxZoom: data.max_zoom,

				continuousWorld: true,

				attribution: "&copy; ArenaNet, Inc.",

				reuseTiles: true,

				subdomains: [1, 2, 3, 4],
			});
		}

		var _layerobj = [],
			_layermaps = [];

		for (var i in _layerids)
		{
			var name = _layerids[i];

			if (i == name) continue;

			_layermaps[_layer[name]._name] = _layerobj[i - 1] = L.tileLayer(_layer[name]._tileuri, _layer[name]);
		}

		return {
			layer: _layer,
			layerids: _layerids,
			layerobj: _layerobj,

			baseMaps: _layermaps,
			overlayMaps: {
			},
		};
	})();

	//console.log(layerInit);

	var GW2MapApi = function(id, cid)
	{
		$.extend(this, {
			_defaults: {
				options: {
					map: {
						crs: L.CRS.Simple,
						zoomControl: true,
						attributionControl: true,

						doubleClickZoom: false,

						trackResize: true,

						inertia: true,

						fadeAnimation: true,
						zoomAnimation: true,

						keyboard: true,
					},
				},
			},

			data: {
				inited: false,
			},

			init: function()
			{
				if (!this.data.inited)
				{
					$.extend(this.data, {
						inited: true,
					}, layerInit);

					this.map();

					L.control.attribution(
					{
						prefix: false
					});

					this.switchLayer(this.cid);
				}
			},

			map: function(options)
			{
				if (!this._map)
				{
					var options = $.extend(
					{
					}, this._defaults.options.map, {
						//layers: this.data.layerobj
					}, options);

					this._map = L.map(this.id, options);

					//L.control.layers(this.data.baseMaps).addTo(this._map);
					this.data.layerobj[this.cid - 1].addTo(this._map);
				}

				return this._map;
			},

			project: function(latlng, zoom)
			{
				return this.map().project(latlng.latlng || latlng, zoom || this.map().getMaxZoom());
			},

			unproject: function(coord, zoom)
			{
				return this.map().unproject(coord, zoom || this.map().getMaxZoom());
			},

			dims2bounds: function(dims)
			{
				var southWest = this.unproject([0, dims[0]]);
				var northEast = this.unproject([dims[1], 0]);

				return new L.LatLngBounds(southWest, northEast);
			},

			setView: function(coord, zoom)
			{
				console.log([coord, zoom]);

				return this.map().setView(this.unproject(coord), zoom);
			},

			switchLayer: function(cid)
			{
				var layer = this.data.layer[this.data.layerids[(cid + '').toLowerCase()]];

				this.map().setMaxBounds(this.dims2bounds(layer._size));

				this.setView(layer.center || [0, 0], layer.zoom || 7);
			},
		});

		this.id = id;
		this.cid = cid || 1;
		this._map = null;

		this.init();
	};

	if (typeof define === 'function' && define.amd)
	{
		define('GW2MapApi', [], function()
		{
			return GW2MapApi;
		});
	}

	return window.GW2MapApi = GW2MapApi;

})(jQuery);