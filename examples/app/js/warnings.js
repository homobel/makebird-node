
//~ name Warnings

var warnings = new function() {

	function createWarning(text, type) {
		var node = document.createElement('div');
		node.classList.add('warning');
		node.classList.add(type);
		node.textContent = text;
		return node;
	}

	//~ if this.error
	this.error = function(node, text) {
		node.appendChild(createWarning(text, 'error'));
	};
	//~ endif

	//~ if this.notification
	this.notification = function(node, text) {
		node.appendChild(createWarning(text, 'notification'));
	};
	//~ endif

	//~ if this.info
	this.info = function(node, text) {
		node.appendChild(createWarning(text, 'info'));
	};
	//~ endif

};
