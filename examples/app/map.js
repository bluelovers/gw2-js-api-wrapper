require(['../../src/main'], function()
{

	require(['order!leaflet', 'order!gw2map', 'order!leaflet-plus', 'order!jquery.plus'], function(L, GW2MapApi)
	{
		'use strict';

		var a = $.gw2.getAssetURL('map_complete');

		console.log(a);

		var gw2map = new GW2MapApi("map", 1);
		var map = gw2map.map();

		map.on('click', function(e)
		{
			console.log("You clicked the map at " + gw2map.project(e.latlng));
		}).on('dblclick', function(e)
		{
			if (map.getZoom() === map.getMaxZoom())
			{
				map.setZoom(Math.round(map.getMaxZoom() / 2));
			}
			else
			{
				map.setView(e.latlng, map.getMaxZoom());
			}
		});

		(function(data, map)
		{
			var _wp = [];

			var _style = $('<style id="leaflet-marker-waypoint">.leaflet-marker-waypoint { display: none; }</style>').disable(true).appendTo($('head'));

			var currentIconSize = gw2map.currentIconSize();
			//var pane1 = map.createPane('waypoint');

			var wpIcon = L.icon(
			{
				iconUrl: $.gw2.getAssetURL('map_waypoint'),

				iconSize: [currentIconSize, currentIconSize],

				className: 'leaflet-marker-waypoint',
			});

			var region, gameMap, i, il, poi;

			for (region in data.regions)
			{
				region = data.regions[region];

				for (gameMap in region.maps)
				{
					gameMap = region.maps[gameMap];

					for (i = 0, il = gameMap.points_of_interest.length; i < il; i++)
					{
						poi = gameMap.points_of_interest[i];

						if (poi.type != "waypoint")
						{
							continue;
						}

						var waypoint = L.marker(gw2map.unproject(poi.coord), {
							title: poi.name,
							icon: wpIcon,

							pane: 'waypoint',
						});

						waypoint.on('dblclick', function(e)
						{
							if (map.getZoom() === map.getMaxZoom())
							{
								map.setZoom(Math.round(map.getMaxZoom() / 2));
							}
							else
							{
								map.setView(e.latlng, map.getMaxZoom());
							}
						});

						_wp.push(waypoint);
					}
				}
			}

			var cities = L.layerGroup(_wp);

			var control = L.control.layers(
			{
			}, {
				Waypoint: cities,
			}).addTo(map);

			map.on("zoomstart", function(e)
			{
				//cities.invoke('hide');

				_style.disable(false);
			});

			map.on("zoomend", function(e)
			{
				var currentIconSize = gw2map.currentIconSize();

				if (currentIconSize && map.hasLayer(cities))
				{
					wpIcon.initialize(
					{
						iconSize: [currentIconSize, currentIconSize],
						//iconAnchor: [currentIconSize/2, currentIconSize/2],
					});

					cities.eachLayer(function(layer)
					{
						//gw2map.changeMarkerIcon(layer, wpIcon, currentIconSize);

						layer.updateIconStyles();

						//layer._icon.style.display = '';
						//layer.show();
					});

					_style.disable(true);
				}
			});

			control.toggleOverlay(cities, true);
			_style.disable(true);

		})(gw2map.getMapFloor(), gw2map.map());

		return console.log(gw2map);

	});
});