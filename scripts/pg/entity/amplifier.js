define(["pg/entity", "utils", "config", "dom", "pg/gs"], function (entity, utils, config, dom, gs){

	var amplifier = function () {
		this.name = 'amplifier';
		
		this.gather_range = 2;	
	};

	utils.extend(entity, amplifier);
	
	Object.assign(amplifier.prototype, {
		init: function () {
			var search_tiles = this.map.get_tile_area(this.tile.x, this.tile.y, 1);
			
			for (var search_tile_index = 0; search_tile_index < search_tiles.length; search_tile_index++) {
				var search_tile = search_tiles[search_tile_index];
				
				if (search_tile && search_tile.entity && search_tile.entity.name === 'square') {
					search_tile.entity.project_power(search_tile.entity.power_range + 1);
				}
			}
		},
		
		destroy: function() {
			var search_tiles = this.map.get_tile_area(this.tile.x, this.tile.y, 1);
			
			for (var search_tile_index = 0; search_tile_index < search_tiles.length; search_tile_index++) {
				var search_tile = search_tiles[search_tile_index];
				
				if (search_tile && search_tile.entity && search_tile.entity.name === 'square') {
					search_tile.entity.project_power(search_tile.entity.power_range - 1);
				}
			}
		},
		
		update : function (step_time) {
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
		
		draw : function() {			
			var startX = (config.border_size - config.pixel_size) + (config.pixel_size * this.tile.x);
			var startY = (config.border_size - config.pixel_size) + (config.pixel_size * this.tile.y);
			var width = height = (config.pixel_size - (2 * config.border_size));		
			
			dom.ctx.fillStyle = "#225577";
			dom.ctx.fillRect(startX,startY,width,height);	
		}
	});
	
	entity.typeMap["amplifier"] = amplifier;
	
	return amplifier;
});