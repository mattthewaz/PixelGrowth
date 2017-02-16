define(["pg/gs"], function (gs) {

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
		can_deconstruct : true,
	
		draw : function() {
			
		},
		
		project_power : function (range) {
			var current_range = this.map.get_tile_area(this.tile.x, this.tile.y, this.power_range),
				new_range     = this.map.get_tile_area(this.tile.x, this.tile.y, range);
				
			if (range == this.power_range) {
				return;
			}
			
			if (range > this.power_range) {
				for (var new_tile_index = 0; new_tile_index < new_range.length; new_tile_index++) {
					var new_tile = new_range[new_tile_index];
					if (current_range.indexOf(new_tile) == -1) {
						new_tile.register_source(this.tile);
					}
				}
			}
			
			if (range < this.power_range) {
				for (var old_tile_index = 0; old_tile_index < current_range.length; old_tile_index++) {
					var old_tile = current_range[old_tile_index];
					if (new_range.indexOf(old_tile) == -1) {
						old_tile.remove_source(this.tile);
					}
				}
			}
			
			this.power_range = range;
		},
		
		gather : function () {			
			var gather_tiles = this.map.get_tile_area(this.tile.x, this.tile.y, this.gather_range),
				gather = 0;
			
			for (var gather_tile_index = 0; gather_tile_index < gather_tiles.length; gather_tile_index++) {
				var gather_tile = gather_tiles[gather_tile_index];
				
				if (gather_tile.power_sources.length > 0) {
					gather += gather_tile.pixel_rate;
				}
			}
			
			gs.pixels += ((gather / 1000) * step_time);
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