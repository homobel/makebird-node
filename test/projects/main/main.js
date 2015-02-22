//~ name TestProject
//~ copyright main.txt

//~ base ~.LibA.DOM.Helpers.select
//~ base ~.LibB.*

//~ base ~.Tabs

var App = new function() {
	//~ component widgets/tabs.js

	this.init = function() {
		var tabs = new Tabs(DOM.Helpers.select('.tabs'));
	};
};

App.init();
