define(["dom", "pg/gs", "pg/pixelmap", "pg/render", "pg/engine", "pg/entity/square", "pg/entity/amplifier"], function (dom, gs, pixelmap, render, engine, square, amplifier) {
	
	gs.map = new pixelmap(10);
	
	gs.map.create_entity_at(0,0, 'square');
			
	gs.render = new render();
	gs.render.start(gs.map);
	
	gs.engine = new engine();
	gs.engine.start(gs.map);
});