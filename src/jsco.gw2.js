(function($){
	var unsafeWindow = unsafeWindow || window;

	var _gw2api = new GW2API;
	var _gw2 = (function (){
		this._self = this;
	})();

	$.extend({
		gw2 : _gw2,
	});

	$.extend($.gw2, {
		api : _gw2api,
	});

})(jQuery.noConflict());