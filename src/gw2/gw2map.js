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
				center: [10496, 11656],
				zoom: 3,
			},
		};

		for (var i in continents)
		{
			var data = continents[i];

			var name = data.name.toLowerCase();

			_layerids[i] = _layerids[name] = name;

			_layer[name] = $.extend(true, {}, _default[name], {
			}, {
				// https://tiles.guildwars2.com/1/1/{z}/{x}/{y}.jpg
				_tileuri: $.gw2.getTileURL(i, floor, '{z}', '{x}', '{y}', '{s}'),
				_size: data.continent_dims,

				_data: data,

				_name: data.name,

				minZoom: data.min_zoom,
				maxZoom: data.max_zoom,
				maxNativeZoom: data.max_zoom,
			});
		}

		return {
			layer: _layer,
			layerids: _layerids,
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

					layer: {
						continuousWorld: true,

						attribution: "&copy; ArenaNet, Inc.",

						reuseTiles: true,

						subdomains: [1, 2, 3, 4],

						//noWrap: false,
					},
				},
			},

			data: {
				inited: false,

				options: {
					inited: false,
				},
			},

			init: function(id, cid)
			{
				if (!this.data.inited)
				{
					this._initOptions();
					this._initLayer();


					this.id = id;
					this.cid = cid || 1;
					this._map = null;

					this.data.inited = true;

					this.map();

					L.control.attribution(
					{
						prefix: false
					});

					this.switchLayer(this.cid);

					console.log(this.data);
				}

				return this;
			},

			_initOptions: function()
			{
				$.extend(this.data.options, {
					//inited: true,
				}, this._defaults.options, {
					inited: true,
				});
			},

			_initLayer: function()
			{
				if (!this.data.inited)
				{
					$.extend(this.data, {
						//inited: true,
					}, layerInit);

					for (var i in this.data.layer)
					{
						$.extend(this.data.layer[i], this.data.options.layer);
					}

					var _layerobj = [],
						_layermaps = [];

					for (var i in this.data.layerids)
					{
						var name = this.data.layerids[i];

						if (i == name) continue;

						_layermaps[this.data.layer[name]._name] = _layerobj[i - 1] = L.tileLayer(this.data.layer[name]._tileuri, this.data.layer[name]);
					}

					$.extend(this.data, {
					layerobj: _layerobj,

					baseMaps: _layermaps,
					overlayMaps: {
					}});
				}
			},

			map: function(options)
			{
				if (!this._map)
				{
					var options = $.extend(
					{
					}, this.data.options.map, {
						//layers: this.data.layerobj
					}, this.data.layer[this.data.layerids[(this.cid + '').toLowerCase()]], options);

					this._map = L.map(this.id, options);

					//L.control.layers(this.data.baseMaps).addTo(this._map);
					this.data.layerobj[this.cid - 1].addTo(this._map);
				}

				return this._map;
			},

			project: function(latlng, zoom)
			{
				//console.log([latlng, this.map().getMaxZoom()]);

				return this.map().project(latlng.latlng || latlng, zoom || this.map().getMaxZoom());
			},

			unproject: function(coord, zoom)
			{
				//console.log([coord, this.map().getMaxZoom()]);

				return this.map().unproject(coord, zoom || this.map().getMaxZoom());
			},

			dims2bounds: function(dims)
			{
				var southWest = this.unproject([0, dims[0]]);
				var northEast = this.unproject([dims[1], 0]);

				return new L.LatLngBounds(southWest, northEast);
			},

			dims2center: function(dims, target)
			{
				var target = target || [0, 0];
				target[0] = target[0] || 0;
				target[1] = target[1] || 0;

				var x = target[0] + (dims[0] - target[0])/2;
				var y = target[1] + (dims[1] - target[1])/2;

				return [x, y];
			},

			setView: function(coord, zoom)
			{
				//console.log([coord, zoom]);

				return this.map().setView(coord.latlng ? coord.latlng : this.unproject(coord), zoom || this.map().getZoom());
			},

			switchLayer: function(cid)
			{
				//var layer = this.data.layer[this.data.layerids[(cid + '').toLowerCase()]];
				var layer = this.getMapLayerData(cid);

				this.map().setMaxBounds(this.dims2bounds(layer._size));

				this.setView(layer.center || this.dims2center(layer._size), layer.zoom || this.map().getMaxZoom());

				return this;
			},

			getMapLayerData: function(cid)
			{
				var cid = (cid === undefined) ? this.cid : cid;

				var layer = this.data.layer[this.data.layerids[(cid + '').toLowerCase()]];

				return layer;
			},

			getMapFloor: function(floor)
			{
				return $.gw2.getMapFloor(this.cid, floor || 1);
			},

			currentIconSize: function()
			{
				var currentzoom = this.map().getZoom();

				var currentIconSize = 0;

				// Resize all waypoint icons in all zones
				switch (currentzoom)
				{
					case 7: currentIconSize = 32; break;
					case 6: currentIconSize = 28; break;
					case 5: currentIconSize = 24; break;
					case 4: currentIconSize = 20; break;
					case 3: currentIconSize = 16; break;
				}

				return currentIconSize;
			},

			changeMarkerIcon: function(pMarker, pIconURL, pSize)
			{
				if (pSize === undefined)
				{
					pSize = 32;
				}

				var _options = $.extend({}, pIconURL.options, {
					iconSize: [pSize, pSize],
					iconAnchor: [pSize/2, pSize/2],
				});

				pMarker.setIcon(new L.icon(_options));
			},
		});

		this.init(id, cid);
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