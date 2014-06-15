require(['../../src/main'], function()
{

	require(['order!leaflet', 'order!gw2map', 'order!leaflet-plus', 'order!jquery.plus'], function(L, GW2MapApi)
	{
		'use strict';

		var gw2map = new GW2MapApi("map", 1);
		var map = gw2map.map();

		gw2map.on('click', GW2MapApi.Util.hookMapCoord).on('dblclick', GW2MapApi.Util.hookZoomOutIn);

		(function(data)
		{
			var _wp = [];

			$('<style>.leaflet-control label img { vertical-align: text-bottom; }</style>').appendTo($('head'));

			var currentIconSize = gw2map.currentIconSize();
			var pane_waypoint = map.createPane('waypoint');

			var wpIcon = gw2map.getIcon('waypoint', {
				iconSize: GW2MapApi.Util.toSize(currentIconSize),
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

							pane: pane_waypoint,
						});

						gw2map.on('dblclick', waypoint, GW2MapApi.Util.hookZoomOutIn);

						_wp.push(waypoint);
					}
				}
			}

			var cities = L.layerGroup(_wp);

			gw2map.addOverlay(cities, '<img src="' + wpIcon.options.iconUrl + '" height="16" width="16"/> Waypoint');

			var $pane_waypoint = $(pane_waypoint);

			map.on("zoomstart", function(e)
			{
				$pane_waypoint.hide();
			});

			map.on("zoomend", function(e)
			{
				var currentIconSize = gw2map.currentIconSize();

				if (currentIconSize && map.hasLayer(cities))
				{
					wpIcon.setOptions(
					{
						iconSize: GW2MapApi.Util.toSize(currentIconSize),
					});

					cities.eachLayer(function(layer)
					{
						layer.updateIconStyles();
					});

					$pane_waypoint.show();
				}
			});

			gw2map.getControl('layers').toggleOverlay(cities, true);

		})(gw2map.getMapFloor());

		return console.log(gw2map);

	});
});