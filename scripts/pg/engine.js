define(["config", "dom"], function (config, dom){
	var engine = function(){
	};
	
	engine.prototype = {
		start : function (pixelmap) {
			this.last_update = Date.now();
			this.map = pixelmap;
			setInterval(this.engineLoop.bind(this), config.engine_speed);
		},
		
		engineLoop : function () {	
			var now = Date.now();
			    step_time = now - this.last_update;
				
			this.map.step(step_time);			
			
			this.last_update = now;
		}
	}
	
	return engine;
});