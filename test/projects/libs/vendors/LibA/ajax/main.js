//~ name Ajax
//~ info Ajax module
//~ copyright main.txt

var Ajax = new function() {

	//~ part requests/modern.js

	//~ if old
	//~ part requests/old.js
	//~ endif

	this.request = function(options) {
		return this._requires(options);
	};

};