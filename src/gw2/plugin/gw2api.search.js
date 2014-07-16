define(['gw2api', 'jsel'], function(gw2api, jsel)
{

	gw2api.include({

		search: function(query, apiname)
		{
			var args = Array.prototype.slice.call(arguments, 1);

			args.unshift('select');

			return this.searchCall.apply(this, args);
		},

		searchAll: function(query, apiname)
		{
			var args = Array.prototype.slice.call(arguments, 1);

			args.unshift('selectAll');

			return this.searchCall.apply(this, args);
		},

		searchCall: function(method, query, apiname)
		{
			var args = Array.prototype.slice.call(arguments, 2);

			var data = jsel(this.get.apply(this, args));

			return data[method](query);
		},

	});

	return gw2api;

});