define(function () {

	var entity = function () {
		this.name = 'entity';
	};

	entity.typeMap = {};
	
	entity.create = function (map, tile, type) {
		var entity = new this.typeMap[type]();
			entity.map = map;
			entity.tile = tile;
			entity.init();
		return entity;
	};

	entity.prototype = {	
		draw : function() {
			
		},
		
		get_details : function () {
			return [];
		},
		
		get_available_buildings : function() {
			return [];
		}
	};
	
	return entity;
});