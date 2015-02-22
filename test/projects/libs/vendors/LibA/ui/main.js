//~ name UI
//~ info UI module
//~ copyright main.txt

function UI() {

	//~ if this.widget

	//~ base ~.LibA.UI.base

	this.widget = function() {
		// widget

		//~ if debug
		console.log('widget');
		//~ endif

	};

	//~ endif

	//~ if this.pane

	this.pane = function() {
		// pane

		//~ if debug
		console.log('pane');
		//~ endif
	};

	//~ endif

	//~ if this.base

	this.base = function() {
		// base

		//~ if debug
		console.log('pane');
		//~ endif
	};

	//~ endif

}