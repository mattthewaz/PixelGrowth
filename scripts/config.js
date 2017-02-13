define(function () {
	var config = {
		//Size of each tile, including border
		pixel_size: 81,
		
		border_size: 4,
		
		play_sizes : [
			//{ width : 200,  height : 100	},
			{ width : 400,  height : 200	},
			{ width : 800,  height : 400	},
			{ width : 1600, height : 800	},
			{ width : 3200, height : 1600	},
		],
		
		default_play_size : 2,
		
		render_speed : 25,
		
		engine_speed : 10,
		
		click_zone : 10
	};
	
	return config;
});