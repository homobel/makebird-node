// Test project
// Homobel
// All Rights Reserved



var App = new function() {

	this.Tabs = function() {

		this.init = function() {
			// init

		};

	}

	this.Tabs.prototype = new UI();

	this.init = function() {
		var tabs = new Tabs(DOM.Helpers.select('.tabs'));
	};
};

App.init();
