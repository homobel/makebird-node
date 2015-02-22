
module.exports = function() {
	
	var res = {};

	for (var i = 0, l = arguments.length; i < l; i++) {

		var arg = arguments[i];

		for (var prop in arg) {
			if (arg.hasOwnProperty(prop)) {
				res[prop] = arg[prop];
			}
		}

	}

	return res;

};
