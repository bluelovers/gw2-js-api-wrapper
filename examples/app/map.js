require(['../../src/main'], function()
{

	require(['order!leaflet', 'order!gw2map', 'order!leaflet-plus', 'order!jquery.plus'], function(L, GW2MapApi)
	{
		'use strict';

		var gw2map = new GW2MapApi('map', 1);
		var map = gw2map.map();

		gw2map.on('click', GW2MapApi.Util.hookMapCoord).on('dblclick', GW2MapApi.Util.hookZoomOutIn);

		(function(data)
		{
			var _wp = [];

			var currentIconSize = gw2map.currentIconSize();
			var pane_waypoint = gw2map.getPane('waypoint');

			var wpIcon = gw2map.getIcon('waypoint');

			var region, gameMap, i, ii, poi, map_id;

			for (ii in data.regions)
			{
				region = data.regions[ii];

				for (map_id in region.maps)
				{
					gameMap = region.maps[map_id];

					for (i in gameMap.points_of_interest)
					{
						poi = gameMap.points_of_interest[i];

						if (poi.type != "waypoint" && poi.type != "unlock")
						{
							continue;
						}

						var waypoint = gw2map.marker(gw2map.unproject(poi.coord), {
							title: poi.name,
							icon: gw2map.getIcon(poi.type),

							pane: pane_waypoint,

							poi: poi,
						});

						gw2map.on('dblclick', waypoint, GW2MapApi.Util.hookZoomOutIn);

						gw2map.on('click', waypoint, function(e)
						{
							GW2MapApi.Util.log(gw2map.project(this.getLatLng()));
						});

						_wp.push(waypoint);
					}
				}
			}

			for (i in GW2MapApi._defaults.temple)
			{
				poi = GW2MapApi._defaults.temple[i];

				poi.type = 'temple';

				var waypoint = gw2map.marker(gw2map.unproject(poi.coord), {
					title: poi.name,
					icon: gw2map.getIcon(poi.type),

					pane: pane_waypoint,

					poi: poi,

					zIndexOffset: 10,
				});

				gw2map.on('dblclick', waypoint, GW2MapApi.Util.hookZoomOutIn);

				gw2map.on('click', waypoint, function(e)
				{
					GW2MapApi.Util.log(gw2map.project(this.getLatLng()));
				});

				_wp.push(waypoint);
			}

			var cities = L.layerGroup(_wp);

			gw2map.addOverlay(cities, '<img src="' + wpIcon.options.iconUrl + '" height="16" width="16"/> Waypoint');

			var $pane_waypoint = $(pane_waypoint);

			gw2map.on("zoomstart", function(e)
			{
				$pane_waypoint.stop().hide();
			}).on("zoomend", function(e)
			{
				var currentIconSize = gw2map.currentIconSize();

				if (currentIconSize && map.hasLayer(cities))
				{
					cities.eachLayer(function(layer)
					{
						layer.updateIconStyles(
						{
							iconSize: GW2MapApi.Util.toSize(currentIconSize),
						});
					});

					$pane_waypoint.fadeIn('slow');
				}
			}).getControl('layers').toggleOverlay(cities, true);

			$pane_waypoint.stop().hide().delay(1000).fadeIn('slow');

		})(gw2map.getMapFloor());

		return console.log(gw2map);

	});
});