define(function(){
	var util = {};

	if (!Date.now) {
	  Date.now = function now() {
		return new Date().getTime();
	  };
	}
	
	// First, checks if it isn't implemented yet.
	if (!String.prototype.format) {
	  String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) { 
		  return typeof args[number] != 'undefined'
			? args[number]
			: match
		  ;
		});
	  };
	}
	
	/**
	 * Extends one class with another.
	 *
	 * @param {Function} destination The class that should be inheriting things.
	 * @param {Function} source The parent class that should be inherited from.
	 * @return {Object} The prototype of the parent.
	 */
	util.extend = function (source, destination) {
		destination.prototype = Object.create(source.prototype);
		destination.prototype.constructor = destination;
		destination.parent = source.prototype;
	};
	
	return util;
});