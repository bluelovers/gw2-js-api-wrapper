require(["../../src/main"], function()
{

	require(["leaflet"], function()
	{
		"use strict";

		var GW2MapApi = function(){



		};

		var map;

		function unproject(coord)
		{
			return map.unproject(coord, map.getMaxZoom());
		}

		function onMapClick(e)
		{
			console.log("You clicked the map at " + map.project(e.latlng, map.getMaxZoom()));
		}



		var southWest, northEast;

		map = L.map("map", {
			minZoom: 0,
			maxZoom: 7,
			crs: L.CRS.Simple,
			zoomControl: true,
			attributionControl: true,

			doubleClickZoom: false,

			trackResize: true,

			inertia: true,

			fadeAnimation: true,
			zoomAnimation: true,

		});
		map.setView(unproject([16605, 15452]), 7);

		L.control.attribution(
		{
			prefix: false
		});

		southWest = unproject([0, 32768]);
		northEast = unproject([32768, 0]);

		map.setMaxBounds(new L.LatLngBounds(southWest, northEast));

		var tyria = L.tileLayer("https://tiles.guildwars2.com/1/1/{z}/{x}/{y}.jpg", {
			minZoom: 0,
			maxZoom: 7,
			continuousWorld: true,
			attribution: "&copy; ArenaNet, Inc.",
			// All rights reserved. NCsoft, the interlocking NC logo, ArenaNet, Guild Wars, Guild Wars Factions, Guild Wars Nightfall, Guild Wars: Eye of the North, Guild Wars 2, and all associated logos and designs are trademarks or registered trademarks of NCsoft Corporation. All other trademarks are the property of their respective owners."
		}).addTo(map);

		tyria.max_bounds = [[0, 32768], [32768, 0]];
		tyria.continent = 1;

		map.on("click", onMapClick);

		0 && $.getJSON("https://api.guildwars2.com/v1/map_floor.json?continent_id=1&floor=1", function(data)
		{
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

						L.marker(unproject(poi.coord), {
							title: poi.name + ' ' + poi.coord
						}).addTo(map);
					}
				}
			}
		});

		$("#map").height($(window).height()).width($(window).width());

		//	map.invalidateSize();

	});
});