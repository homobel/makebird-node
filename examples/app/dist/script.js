/*
* test app example
* (C) Archy Sharp 2016
*/




(function() {

	var warnings = new function() {

		function createWarning(text, type) {
			var node = document.createElement('div');
			node.classList.add('warning');
			node.classList.add(type);
			node.textContent = text;
			return node;
		}

		this.error = function(node, text) {
			node.appendChild(createWarning(text, 'error'));
		};

		this.notification = function(node, text) {
			node.appendChild(createWarning(text, 'notification'));
		};

	};

	var body = document.body;

	warnings.notification(body, 'Notification message');

	warnings.error(body, 'Error message');

	// just example of part token

})();

