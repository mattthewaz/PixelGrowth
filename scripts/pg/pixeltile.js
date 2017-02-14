define(["dom", "config", "pg/entity"], function (dom, config, entity) {

	var pixeltile = function (x, y, map) {
		this.x = x;
		this.y = y;
		this.map = map;
		this.name = 'empty tile';
		
		this.power_sources = [];
		
		this.entity = null;
		
		this.pixel_rate = 1;
	};

	pixeltile.prototype = {
		register_source : function (tile) {
			if (this.power_sources.indexOf(tile) == -1) {
				this.power_sources.push(tile);
			}
		},
		
		remove_source : function (tile) {
			var sourceIndex = this.power_sources.indexOf(tile);
			
			if (sourceIndex > -1) {
				this.power_sources.splice(sourceIndex, 1);
			}
		},
		
		update_entity: function (step_time){
			if (this.entity != null) {
				this.entity.update(this.map, this, step_time);
			}		
		},
		
		create_entity: function (type) {
			return this.entity = entity.create(this.map, this, type);
		},
		
		draw: function () {
			if (this.entity){
				this.entity.draw(this);
			} else {			
				var startX = (config.border_size - config.pixel_size) + (config.pixel_size * this.x);
				var startY = (config.border_size - config.pixel_size) + (config.pixel_size * this.y);
				var width = height = (config.pixel_size - (2 * config.border_size));		
				
				dom.ctx.fillStyle = "#663300";
				
				if (this.power_sources.length > 0) {
					dom.ctx.fillStyle = "#999999";
				}
				
				dom.ctx.fillRect(startX,startY,width,height);		
			}
		},
		
		draw_selection: function () {			
			var startX = (config.border_size - config.pixel_size) + (config.pixel_size * this.x);
			var startY = (config.border_size - config.pixel_size) + (config.pixel_size * this.y);
			var width = height = (config.pixel_size - (2 * config.border_size));		
			
			dom.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
			
			dom.ctx.fillRect(startX,startY,width,height);		
		},
		
		get_name : function () {
			if (this.entity) {
				return this.entity.name;
			}
			
			return this.name;
		},
		
		get_details_panel : function () {
			var nodes = [],
		        header = document.createElement('div');
			header.className = 'label';
			header.innerHTML = this.get_name();
			
			nodes.push(header);
			
			if (this.entity) {
				nodes = nodes.concat(this.entity.get_details());
			} 
			
			return nodes;
		},
		
		get_actions_panel : function () {
			var nodes = [],
				buildings = this.get_available_buildings(),
			    header = document.createElement('div'),
				building,
				buildingNode;
				
			header.className = 'label';
			header.innerHTML = 'actions';
			
			nodes.push(header);
			
			for (var i = 0; i < buildings.length; i++) {
			    building     = buildings[i];
				
				buildingNode = document.createElement('div');
				buildingNode.className = 'building';
				buildingNode.innerHTML = building;				
				buildingNode.id = building;		

				nodes.push(buildingNode);
			}
			
			return nodes;
		},
		
		get_available_buildings: function () {
			var buildings = [];
			
			if (this.entity) {
				buildings = this.entity.get_available_buildings();
			} else {
				buildings.push('amplifier');
			}			
			
			return buildings;
		},
		
		on_action_click : function (event) {			
			var buildings = this.get_available_buildings(),
				action    = event.target.id;
			
			if (buildings.indexOf(action) != -1) {
				this.map.create_entity_at(this.x, this.y, action);
			}
		}
	};
	
	return pixeltile;
});