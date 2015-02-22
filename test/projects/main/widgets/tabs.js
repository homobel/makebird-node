//~ name Tabs
//~ info tabs widget

//~ base ~.LibA.UI.widget
//~ base ~.LibA.Ajax

this.Tabs = function() {
	
	this.init = function() {
		// init
		//~ if debug
		console.log('tabs init');
		//~ endif
	};

	//~ if this.ajax

	this.ajax = function() {
		// ajax
		Ajax.request({});
		//~ if debug
		console.log('tabs ajax');
		//~ endif
	};

	//~ endif

	//~ if this.vertical

	this.vertical = function() {
		// vertical
		//~ if debug
		console.log('tabs vertical');
		//~ endif
	};

	//~ endif

}

this.Tabs.prototype = new UI();
