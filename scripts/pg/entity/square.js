define(["pg/entity", "utils", "config", "dom", "pg/gs"], function (entity, utils, config, dom, gs){

	var square = function () {
		this.name = 'square';
		
		this.gather_range = 2;
		this.power_range = 0;		
	};

	utils.extend(entity, square);
	
	Object.assign(square.prototype, {
		init: function () {
			this.project_power(2);
		},
		
		update : function (step_time) {
			this.gather();
		},
		
		draw : function() {			
			var startX = (config.border_size - config.pixel_size) + (config.pixel_size * this.tile.x);
			var startY = (config.border_size - config.pixel_size) + (config.pixel_size * this.tile.y);
			var width = height = (config.pixel_size - (2 * config.border_size));		
			
			dom.ctx.fillStyle = "#227755";
			dom.ctx.fillRect(startX,startY,width,height);	
		}
	});
	
	entity.typeMap["square"] = square;
	
	return square;
});