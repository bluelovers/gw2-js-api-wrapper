require(['../../src/main'], function()
{

	require(['order!leaflet', 'order!gw2map', 'order!leaflet-plus', 'order!jquery.plus'], function(L, GW2MapApi)
	{
		'use strict';

		var gw2map = new GW2MapApi("map", 1);
		var map = gw2map.map();

		map.on('click', function(e)
		{
			console.log("You clicked the map at " + gw2map.project(e.latlng));
		});

		gw2map.hookZoom('dblclick');

		(function(data, map)
		{
			var _wp = [];

			//var _style = $('<style id="leaflet-marker-waypoint">.leaflet-marker-waypoint { display: none; }</style>').disable(true).appendTo($('head'));

			$('<style>.leaflet-control label img { vertical-align: text-bottom; }</style>').appendTo($('head'));

			var currentIconSize = gw2map.currentIconSize();
			var pane_waypoint = map.createPane('waypoint');

			var wpIcon = gw2map.getIcon('waypoint', {
				iconSize: [currentIconSize, currentIconSize]
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

						gw2map.hookZoom('dblclick', waypoint);

						_wp.push(waypoint);
					}
				}
			}

			var cities = L.layerGroup(_wp);

			gw2map.data.overlayMaps['<img src="' + wpIcon.options.iconUrl + '" height="16" width="16"/> Waypoint'] = cities;

			var control = L.control.layers(
			{
			}, gw2map.data.overlayMaps).addTo(map);

			map.on("zoomstart", function(e)
			{
				//cities.invoke('hide');

				//_style.disable(false);
				$(pane_waypoint).hide();
			});

			map.on("zoomend", function(e)
			{
				var currentIconSize = gw2map.currentIconSize();

				if (currentIconSize && map.hasLayer(cities))
				{
					wpIcon.setOptions(
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

					//_style.disable(true);
					$(pane_waypoint).show();
				}
			});

			control.toggleOverlay(cities, true);
			//_style.disable(true);

		})(gw2map.getMapFloor(), gw2map.map());

		return console.log(gw2map);

	});
});