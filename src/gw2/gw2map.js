(function($, require, undefined)
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

			_layer[name] = $.extend(true, {
			}, _default[name], {
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

			data: {
				inited: false,

				options: {
					inited: false,
				},

				cache: {
					global: {

					},
				},
			},

			init: function(id, data)
			{
				if (!this.data.inited)
				{
					this._initOptions(data);
					this._initLayer();

					this.id = id;
					this.cid = this.data.options.cid;
					this._map = null;

					this.data.inited = true;

					this.map();

					L.control.attribution(
					{
						prefix: false
					});

					this.switchLayer(this.cid);

					//console.log(this.data);
				}

				return this;
			},

			_initOptions: function(data)
			{
				var data = this._initData(data);

				$.extend(this.data.options, {
					//inited: true,
				}, GW2MapApi._defaults.options, data, {
					inited: true,
				});
			},

			_initData: function(data)
			{
				if (!isNaN(data))
				{
					data =
					{
						cid: data,
					};
				}
				else
				{
					$.extend(data, GW2MapApi._defaults.data);
				}

				data.cid = data.cid || GW2MapApi._defaults.cid;

				return data;
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
						}
					});
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

				var x = target[0] + (dims[0] - target[0]) / 2;
				var y = target[1] + (dims[1] - target[1]) / 2;

				return [x, y];
			},

			setView: function(coord, zoom)
			{
				return this.map().setView(coord.latlng ? coord.latlng : this.unproject(coord), zoom);
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

			currentIconSize: function(currentzoom)
			{
				return GW2MapApi.Util.currentIconSize((currentzoom === undefined) ? this.map().getZoom() : currentzoom);
			},

			changeMarkerIcon: function(pMarker, pIconURL, pSize)
			{
				if (pSize === undefined)
				{
					pSize = this.currentIconSize(this.map().getMaxZoom());;
				}

				var _options = $.extend(
				{
				}, pIconURL.options, {
					iconSize: [pSize, pSize],
					iconAnchor: [pSize / 2, pSize / 2],
				});

				pMarker.setIcon(new L.icon(_options));
			},

			getIcon: function(name, options, clone)
			{
				var name = GW2MapApi.Util.poiIcon(name);

				if (!clone && this.getCache('icon', name))
				{
					return this.getCache('icon', name);
				}
				else
				{
					return this.setCache('icon', name, GW2MapApi.Util.getIcon(name, options));
				}
			},

			setCache: function(tag, name, value, sub)
			{
				var tag = tag || 'global';

				if (!this.data.cache[tag]) this.data.cache[tag] =
				{
				};

				if (sub)
				{
					if (!this.data.cache[tag][name])
					{
						this.data.cache[tag][name] =
						{
						};
					}

					return this.data.cache[tag][name][sub] = value;
				}

				return this.data.cache[tag][name] = value;
			},

			getCache: function(tag, name, sub)
			{
				var tag = tag || 'global';

				if (!this.data.cache[tag] || !this.data.cache[tag][name]) return;

				if (sub)
				{
					if (this.data.cache[tag][name][sub])
					{
						return this.data.cache[tag][name][sub];
					}

					return;
				}

				return this.data.cache[tag][name];
			},

			on: function(event, who, data, fn)
			{
				if (GW2MapApi.Util.isFunc(who))
				{
					var fn = who;
					var who = undefined;
					var data =
					{
					};
				}
				else if (GW2MapApi.Util.isFunc(data))
				{
					var fn = data;
					var data =
					{
					};
				}
				else if (!data)
				{
					var data =
					{
					};
				}

				var event = GW2MapApi.Util.fixEvent(event);

				if (L.Util.isArray(who))
				{
					for (var i in who)
					{
						this.on(event, i, data, fn);
					}

					return this;
				}

				var who = who || this.map();

				L.Util.extend(data, {
					map: data.map || this.map(),

					gw2map: this,

					_disable: (data._disable === undefined && this.data.options.disableAutoHookData) ? true : data._disable,
				});

				//console.log(data);

				who.on(event, data._disable ? fn : function(e)
				{
					//console.log(e, data);

					return fn.call(this, e, data);
				});

				return this;
			},

			getControl: function(name)
			{
				if (!name)
				{
					return this.getCache('obj', 'control');
				}
				else if (!this.getCache('obj', 'control', name))
				{
					this.setControl(name, this._getControl(name).addTo(this.map()));
				}

				return this.getCache('obj', 'control', name);
			},

			setControl: function(name, value)
			{
				this.setCache('obj', 'control', value, name);

				return this;
			},

			_getControl: function(name)
			{
				var control;

				switch (name)
				{
				case 'layers':
					control = L.control.layers(
					{
					}, this.data.overlayMaps);
					break;
				}

				return control;
			},

			addOverlay: function(layer, name)
			{
				this.getControl('layers').addOverlay(layer, name);

				return this;
			},

			getPane: function(name)
			{
				return this._hookGetCache('obj', 'pane', name, function(name)
				{
					return this.map().createPane(name);
				});
			},

			_hookGetCache: function(tag, name, sub, fn)
			{
				if (!sub)
				{
					return this.getCache(tag, name);
				}
				else if (!this.getCache(tag, name, sub))
				{
					this.setCache(tag, name, fn.call(this, sub, name, tag), sub);
				}

				return this.getCache(tag, name, sub);
			},

			marker: function(latlng, options)
			{
				var options = this._hookOption('marker', options);

				return L.marker(latlng, options);
			},

			_hookOption: function(tag, options)
			{
				return $.extend({}, this.data.options[tag], options);
			},

		});

		this.init(id, cid);
	};

	GW2MapApi.Util = $.extend(
	{
	}, {
		fixEvent: function(event)
		{
			return event = event === 'mouseenter' ? 'mouseover' : event === 'mouseleave' ? 'mouseout' : event;
		},

		isFunc: function(func)
		{
			return (typeof func === 'function');
		},

		hookZoomOutIn: function(e, data)
		{
			//console.log([e, data]);

			var map = data.map;

			if (map.getZoom() === map.getMaxZoom())
			{
				map.setZoom(Math.round(map.getMaxZoom() / 2));
			}
			else
			{
				map.setView(e.latlng, map.getMaxZoom());
			}
		},

		log: function(msg)
		{
			console.log(arguments.length > 1 ? arguments : msg);
		},

		hookMapCoord: function(e, data)
		{
			GW2MapApi.Util.log('Current map at ' + data.map.project(e.latlng));
		},

		getIcon: function(name, options)
		{
			if (!GW2MapApi.Media[name])
			{
				var name = GW2MapApi.Util.poiIcon(name);

				if ($.gw2.getAsset('map_' + name))
				{
					GW2MapApi.Util.addMediaIcon(name, 'map_' + name);
				}
			}

			return L.icon(GW2MapApi.Media[name]).setOptions(options);
		},

		currentIconSize: function(currentzoom)
		{
			var currentIconSize = 0;

			// Resize all waypoint icons in all zones
			switch (currentzoom)
			{
			case 7:
				currentIconSize = 32;
				break;
			case 6:
				currentIconSize = 28;
				break;
			case 5:
				currentIconSize = 24;
				break;
			case 4:
				currentIconSize = 20;
				break;
			case 3:
				currentIconSize = 16;
				break;
			}

			return currentIconSize;
		},

		toSize: function(width, height)
		{
			if (width.width || width.height)
			{
				return [width.width || 0, width.height || 0]
			}

			return [width, height || width];
		},

		addMediaIcon: function(id, icon, options)
		{
			return GW2MapApi.Media[id] = $.extend(
			{
				iconUrl: $.gw2.getAssetURL(icon) || icon,

				iconSize: GW2MapApi.Util.toSize(GW2MapApi._defaults.iconSize),

				className: 'leaflet-marker-' + id,
			}, options);
		},

		getPath: function(id, file)
		{
			return GW2MapApi._defaults.path[(id || 'images')] + (arguments.length > 2 ? Array.prototype.slice.call(arguments, 1).join('/') : file);
		},

		/*
		poiToMarker: function(poi, options, map)
		{
			L.marker(gw2map.unproject(poi.coord), {
				title: poi.name,
				icon: GW2MapApi.Util.poiIcon(poi),

				pane: pane_waypoint,
			});
		},
		*/

		poiIcon: function(poi)
		{
			var type = (poi.type || poi);

			return GW2MapApi._defaults.poiIcon[type] || type;
		},

	});

	GW2MapApi.Media = $.extend(GW2MapApi.Media, {});

	GW2MapApi._defaults = $.extend(GW2MapApi._defaults, {
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

				//noWrap: true,
				continuousWorld: true,

				//bounceAtZoomLimits: false,

				//worldCopyJump: true,

				//markerZoomAnimation: false,
			},

			layer: {
				//noWrap: true,
				continuousWorld: true,

				attribution: "&copy; ArenaNet, Inc.",

				reuseTiles: true,

				subdomains: [1, 2, 3, 4],

				errorTileUrl: L.Util.emptyImageUrl,

				//noWrap: false,
			},

			marker: {
				keyboard: false,
				riseOnHover: true,
			},
		},

		iconSize: 32,

		data: {

		},

		cid: 1,

		path: {
			base: require.toUrl('gw2map') + '/../',
			images: require.toUrl('gw2map') + '/../images/',
		},

		poiIcon: {
			unlock: 'dungeon',
			landmark: 'poi',
		},

		_init: function()
		{
			GW2MapApi.Util.addMediaIcon('waypoint', 'map_waypoint', {
				iconHoverUrl: $.gw2.getAssetURL('map_waypoint_hover'),
			});

			GW2MapApi.Util.addMediaIcon('player', GW2MapApi.Util.getPath('images', 'player.png'));
			GW2MapApi.Util.addMediaIcon('temple', GW2MapApi.Util.getPath('images', 'temple.png'));
			GW2MapApi.Util.addMediaIcon('boss', GW2MapApi.Util.getPath('images', 'boss.png'));

			GW2MapApi.Util.addMediaIcon('camera', GW2MapApi.Util.getPath('images', 'camera.png'), {
				iconSize: [110, 75],
			});

			$.stylesheet('body, .leaflet-container, .leaflet-popup-pane, .leaflet-control').css('cursor', 'url("' + GW2MapApi.Util.getPath('images', 'auto.png') + '"), auto');
		},

		temple: {
		"Temple of Balthazar": {
			"coord": [15090.7, 24650.9],
			"name": "Temple of Balthazar",
			"map_id": 51
		},
		"Temple of Grenth": {
			"coord": [10456.2, 28691.3],
			"name": "Temple of Grenth",
			"map_id": 62
		},
		"Temple of Melandru": {
			"coord": [11330.2, 26667.5],
			"name": "Temple of Melandru",
			"map_id": 62
		},
		"The Ruined City of Arah": {
			"coord": [11890, 27754],
			"name": "The Ruined City of Arah",
			"map_id": 62
		},
		"Temple of Dwayna": {
			"coord": [12032, 24256],
			"name": "Temple of Dwayna",
			"map_id": 65
		},
		"Temple of Lyssa": {
			"coord": [13130, 23953],
			"name": "Temple of Lyssa",
			"map_id": 65
		}
	},

	});

	GW2MapApi._defaults._init();

	if (typeof module === 'object' && typeof module.exports === 'object')
	{
		module.exports = GW2MapApi;
	}
	else if (typeof define === 'function' && define.amd)
	{
		define('GW2MapApi', [], function()
		{
			return GW2MapApi;
		});
	}

	(function(_old)
	{
		GW2MapApi.noConflict = function()
		{
			unsafeWindow.GW2MapApi = _old;
			return this;
		};

		unsafeWindow.GW2MapApi = GW2MapApi
	})(unsafeWindow.GW2MapApi);

	return GW2MapApi;

})(jQuery, require);