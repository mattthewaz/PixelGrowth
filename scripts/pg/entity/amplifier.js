define(["pg/entity", "utils", "config", "dom", "pg/gs"], function (entity, utils, config, dom, gs){

	var amplifier = function () {
		this.name = 'amplifier';
		
		this.gather_range = 2;	
	};

	utils.extend(entity, amplifier);
	
	Object.assign(amplifier.prototype, {
		init: function (map, tile) {
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
		
		draw : function(tile) {			
			var startX = (config.border_size - config.pixel_size) + (config.pixel_size * tile.x);
			var startY = (config.border_size - config.pixel_size) + (config.pixel_size * tile.y);
			var width = height = (config.pixel_size - (2 * config.border_size));		
			
			dom.ctx.fillStyle = "#225577";
			dom.ctx.fillRect(startX,startY,width,height);	
		}
	});
	
	entity.typeMap["amplifier"] = amplifier;
	
	return amplifier;
});