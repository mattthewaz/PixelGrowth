define(["config"], function(config){
	var dom = {},
	    canvas = document.getElementById("pixelcanvas"),
	    ctx    = canvas.getContext("2d");
		
	dom.canvas = canvas;
	dom.ctx    = ctx;
	
	dom.frame  = document.getElementById("pixelframe");
				
	dom.sidebar = document.getElementById("sidebar");
	
	dom.pixelcount = document.getElementById("pixelcount");
	dom.fps = document.getElementById("fps");
	
	dom.add_tile_details = function (tile) {		
		var tile_details = tile.get_details_panel(),
			tile_actions = tile.get_actions_panel(),
			details_panel = document.getElementById("details"),
			actions_panel = document.getElementById("actions");
			
		if (details_panel) {
			this.sidebar.removeChild(details_panel);
		}
		
		if (actions_panel) {
			this.sidebar.removeChild(actions_panel);
		}
		
		if (tile_details) {
			details_panel = document.createElement('div');
			details_panel.id = 'details';
			details_panel.className = 'infobox';
			
			for (var i = 0; i < tile_details.length; i++) {
				var detail = tile_details[i];
				details_panel.appendChild(detail);
			}	
			
			this.sidebar.appendChild(details_panel);	
		}
		
		if (tile_actions) {
			actions_panel = document.createElement('div');
			actions_panel.id = 'actions';
			actions_panel.className = 'infobox';
			
			for (var i = 0; i < tile_actions.length; i++) {
				var action = tile_actions[i];
				actions_panel.appendChild(action);
			}		
			
			this.sidebar.appendChild(actions_panel);	
		}
	};
		
	return dom;
});