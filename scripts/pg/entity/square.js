define(["pg/entity", "utils", "config", "dom", "pg/gs"], function (entity, utils, config, dom, gs){

	var square = function () {
		this.name = 'square';
		
		this.gather_range = 2;
		this.power_range = 0;		
	};

	utils.extend(entity, square);
	
	Object.assign(square.prototype, {
		init: function (map, tile) {
			this.project_power(map, tile, 2);
		},
		
		update : function (map, tile, step_time) {
			var gather_tiles = map.get_tile_area(tile.x, tile.y, this.gather_range),
				gather = 0;
			
			for (var gather_tile_index = 0; gather_tile_index < gather_tiles.length; gather_tile_index++) {
				var gather_tile = gather_tiles[gather_tile_index];
				
				if (gather_tile.power_sources.length > 0) {
					gather += gather_tile.pixel_rate;
				}
			}
			
			gs.pixels += ((gather / 1000) * step_time);
		},
		
		project_power : function (map, tile, range) {
			var current_range = map.get_tile_area(tile.x, tile.y, this.power_range),
				new_range     = map.get_tile_area(tile.x, tile.y, range);
				
			if (range == this.power_range) {
				return;
			}
			
			if (range > this.power_range) {
				for (var new_tile_index = 0; new_tile_index < new_range.length; new_tile_index++) {
					var new_tile = new_range[new_tile_index];
					if (current_range.indexOf(new_tile) == -1) {
						new_tile.register_source(tile);
					}
				}
			}
			
			if (range < this.power_range) {
				for (var old_tile_index = 0; old_tile_index < current_range.length; old_tile_index++) {
					var old_tile = current_range[old_tile_index];
					if (new_range.indexOf(old_tile) == -1) {
						old_tile.remove_source(tile);
					}
				}
			}
			
			this.power_range = range;
		},
		
		draw : function(tile) {			
			var startX = (config.border_size - config.pixel_size) + (config.pixel_size * tile.x);
			var startY = (config.border_size - config.pixel_size) + (config.pixel_size * tile.y);
			var width = height = (config.pixel_size - (2 * config.border_size));		
			
			dom.ctx.fillStyle = "#227755";
			dom.ctx.fillRect(startX,startY,width,height);	
		}
	});
	
	entity.typeMap["square"] = square;
	
	return square;
});