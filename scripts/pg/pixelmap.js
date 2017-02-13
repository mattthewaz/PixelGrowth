define(["dom", "config", "pg/pixeltile"], function(dom, config, pixeltile) {
	
	var pixelmap = function(size){	
		this.map = {};
		this.entity_map = {};
		this.transform_x = 0;
		this.transform_y = 0;
		
		this.minX = -size;
		this.maxX =  size;
		this.minY = -size;
		this.maxY =  size;
		
		for (var i = -size; i <= size; i++)	{	
			this.map[i] = {};
			for (var j = -size; j <= size; j++)	{
				this.map[i][j] = new pixeltile(i, j, this);
			}	
		}
	
				
		this.zoom_level = config.default_play_size;
		
		dom.canvas.width  = config.play_sizes[this.zoom_level].width;
		dom.canvas.height = config.play_sizes[this.zoom_level].height;
		
		var tranlate_x_start = (config.play_sizes[config.default_play_size].width  + config.pixel_size ) / 2;
		var tranlate_y_start = (config.play_sizes[config.default_play_size].height + config.pixel_size ) / 2;
		
		this.translate_map(tranlate_x_start, tranlate_y_start);
				
		dom.canvas.addEventListener("mousedown", this.on_mouse_down.bind(this));
		dom.canvas.addEventListener("mouseup", this.on_mouse_up.bind(this));
		dom.canvas.addEventListener("mousemove", this.on_mouse_move.bind(this));
		dom.canvas.addEventListener("mousewheel", this.on_mouse_wheel.bind(this));
	}
	
	pixelmap.prototype = {
	
		get_tile_at : function (x, y) {
			if (this.map[x] && this.map[x][y]) {
				return this.map[x][y];
			}
		},
		
		get_tile_area : function (x, y, range) {
			var area_tiles,
				tile;
			
			if (range == 0) {
				return [this.get_tile_at(x, y)];
			}							
		
			area_tiles = this.get_tile_area(x, y, range - 1);			
			
			for (var i = 0; i < range; i++) {
				var j = range - i;
				
				var north_tile = this.get_tile_at(i + x, j + y);
				north_tile && area_tiles.push(north_tile);
				
				var east_tile = this.get_tile_at(j + x, -i + y);
				east_tile && area_tiles.push(east_tile);
				
				var south_tile = this.get_tile_at(-i + x, -j + y);
				south_tile && area_tiles.push(south_tile);
				
				var west_tile = this.get_tile_at(-j + x, i + y);
				west_tile && area_tiles.push(west_tile);
			}
			
			return area_tiles;
		},
		
		create_entity_at : function (x, y, type) {
			var tile = this.get_tile_at(x,y),
			    entity;
			
			if (tile) {
				entity = tile.create_entity(type);
				this.entity_map[x] = this.entity_map[x] || {};
				this.entity_map[x][y] = tile;
			}
		},
		
		step : function (step_time) {
			for (var column in this.entity_map) {
				for (var row in this.entity_map[column]) {
					var tile = this.entity_map[column][row];
					tile.update_entity(step_time);
				}
			}
		},
		
		set_zoom : function (zoom_level) {
			zoom_level = Math.max(zoom_level, 0);
			zoom_level = Math.min(zoom_level, config.play_sizes.length - 1);
			
			if (this.zoom_level != zoom_level) {							
				this.translate_map(-((config.play_sizes[this.zoom_level].width  + config.pixel_size ) / 2),
								   -((config.play_sizes[this.zoom_level].height + config.pixel_size ) / 2));
								
				var diff_x = this.transform_x;
				var diff_y = this.transform_y;
				
				this.zoom_level = zoom_level;
				
				dom.canvas.width  = config.play_sizes[zoom_level].width;
				dom.canvas.height = config.play_sizes[zoom_level].height;
				
				this.translate_map(((config.play_sizes[this.zoom_level].width  + config.pixel_size ) / 2),
								   ((config.play_sizes[this.zoom_level].height + config.pixel_size ) / 2));
								
				dom.ctx.translate(diff_x, diff_y);
			}
		},
		
		draw_map : function () {
			var x_range  = Math.round(dom.canvas.width  / config.pixel_size) + 1,
			    y_range  = Math.round(dom.canvas.height / config.pixel_size) + 1,
			    x_offset = Math.round(this.transform_x  / config.pixel_size),
			    y_offset = Math.round(this.transform_y  / config.pixel_size),
				start_x  = Math.max(0 - x_offset, this.minX),
				start_y  = Math.max(0 - y_offset, this.minY),
				end_x    = Math.min(start_x + x_range, this.maxX),
				end_y    = Math.min(start_y + y_range, this.maxY);
						
			dom.ctx.clearRect(0-this.transform_x, 0-this.transform_y, dom.canvas.width, dom.canvas.height);
			
			for (var columnIndex = start_x; columnIndex <= end_x; columnIndex++) {
				var column = this.map[columnIndex];
				for (var tileIndex = start_y; tileIndex <= end_y; tileIndex++) {
					var tile = column[tileIndex];
					tile.draw();
				}
			}
			
			if (this.selected_tile) {
				this.selected_tile.draw_selection();
			}
		},
		
		enforce_boundaries: function () {
			var x_range    = Math.round(dom.canvas.width  / config.pixel_size) + 1,
			    y_range    = Math.round(dom.canvas.height / config.pixel_size) + 1,
				map_width  = 1 + this.maxX - this.minX,
				map_height = 1 + this.maxY - this.minY,
				x_pos      = this.transform_x,
				y_pos      = this.transform_y;
			
			//Scrolled too far right?
			if (this.transform_x < ((-1 - this.maxX) * config.pixel_size) + dom.canvas.width) {
				x_pos = ((-1 - this.maxX) * config.pixel_size) + dom.canvas.width;
			}
			
			//Scrolled too far left?
			if (this.transform_x > ((2 - this.minX) * config.pixel_size)) {
				x_pos = ((2 - this.minX) * config.pixel_size);
			}
			
			//Scrolled too far up?
			if (this.transform_y > ((2 + this.maxY) * config.pixel_size)) {
				y_pos = ((2 + this.maxY) * config.pixel_size);
			}
			
			//Scrolled too far down?
			if (this.transform_y < ((this.minY - 1) * config.pixel_size) + dom.canvas.height) {
				y_pos = ((this.minY - 1) * config.pixel_size) + dom.canvas.height;
			}
			
			//Check to see if map is bigger than view
			if (map_width < x_range) {
				x_pos = ((config.play_sizes[this.zoom_level].width + config.pixel_size) / 2);
			}
			
			if (map_height < y_range) {
				y_pos = ((config.play_sizes[this.zoom_level].height + config.pixel_size) / 2);
			}
				
			this.translate_map_to(x_pos, y_pos);
		},
		
		translate_map : function (x, y) {
			this.transform_x += x;
			this.transform_y += y;
			
			dom.ctx.translate(x, y);
		},
		
		translate_map_to : function (x, y) {
			var diff_x = x - this.transform_x,
			    diff_y = y - this.transform_y;
			
			this.translate_map(diff_x, diff_y);
		},
		
		//Takes coordinates in map units
		select_tile_at: function (x, y) {
			//Convert to tile units
			var tile_x = Math.ceil (x / config.pixel_size),
			    tile_y = Math.ceil (y / config.pixel_size),
				tile   = this.get_tile_at(tile_x, tile_y);
			
			if (tile && tile != this.selected_tile) {
				dom.add_tile_details(tile);
			
				this.selected_tile = tile;
			}
		},
		
		on_mouse_down : function (event) {
			var canvas_x = event.x - dom.canvas.offsetLeft,
			    canvas_y = event.y - dom.canvas.offsetTop;
			
			this.drag_x = canvas_x;
			this.drag_y = canvas_y;
			
			this.click_x = canvas_x;
			this.click_y = canvas_y;
			
			this.is_dragging = true;
		},
		
		on_mouse_up : function (event) {
			var frame_x = event.x - dom.canvas.offsetLeft,
			    frame_y = event.y - dom.canvas.offsetTop,
				scalar_x = dom.canvas.width  / dom.frame.clientWidth,
				scalar_y = dom.canvas.height / dom.frame.clientHeight,
				canvas_x = frame_x * scalar_x,
				canvas_y = frame_y * scalar_y,
				click_distance_x = (frame_x - this.click_x),
				click_distance_y = (frame_y - this.click_y),
				click_distance = Math.sqrt(Math.pow(click_distance_x, 2) + Math.pow(click_distance_y, 2));
				
			this.is_dragging = false;
			
			if (click_distance < config.click_zone) {
				var map_x = canvas_x - this.transform_x;
				var map_y = canvas_y - this.transform_y;
				this.select_tile_at(map_x, map_y);
			}
		},
		
		on_mouse_move : function (event) {
			var canvas_x = event.x - dom.canvas.offsetLeft,
				canvas_y = event.y - dom.canvas.offsetTop,
				scalar_x = dom.canvas.width  / dom.frame.clientWidth,
				scalar_y = dom.canvas.height / dom.frame.clientHeight,
				diff_x = (canvas_x - this.drag_x) * scalar_x,
				diff_y = (canvas_y - this.drag_y) * scalar_y;
			
			if (event.buttons == 0) {
				this.is_dragging = false;
			}
			
			if (this.is_dragging) {		
				this.translate_map(diff_x, diff_y);
				
				this.drag_x = canvas_x;
				this.drag_y = canvas_y;
			}
		},
		
		on_mouse_wheel : function (event) {
			var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
			
			if (delta > 0) {
				this.set_zoom(this.zoom_level - 1);
			} else {
				this.set_zoom(this.zoom_level + 1);
			}
		}
	};
	
	return pixelmap;
});