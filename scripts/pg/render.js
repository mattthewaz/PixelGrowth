define(["config", "dom", "pg/gs"], function (config, dom, gs){
	var render = function(){
		this.frames = 0;
		this.fps_timer = Date.now();
	};
	
	render.prototype = {
		start : function (pixelmap) {
			this.map = pixelmap;
			setInterval(this.renderLoop.bind(this), config.render_speed);
		},
		
		renderLoop : function () {	
			this.map.enforce_boundaries();
		
			this.map.draw_map();
						
			this.frames++;
			
			var now = Date.now();
			if (now - this.fps_timer >= 1000){
				dom.fps.innerHTML = this.frames;
				this.fps_timer = this.fps_timer + 1000;
				this.frames = 0;
			}
			
			dom.pixelcount.innerHTML = Math.floor(gs.pixels);
			
		}
	}
	
	return render;
});