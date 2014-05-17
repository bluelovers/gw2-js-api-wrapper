require(["../../src/main"], function()
{

	require(["order!leaflet", 'order!gw2map'], function(L, GW2MapApi)
	{
		"use strict";



		var gw2map = new GW2MapApi("map");

		gw2map.map().on('click', function(e)
		{
			console.log("You clicked the map at " + this.project(e.latlng));
		});

		return console.log(gw2map);

	});
});