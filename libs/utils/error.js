
var util = require('util');

module.exports = {
	syntax: function(path, line, msg, flag) {
		var err = new SyntaxError(util.format('%s at line %d %s', path, line, msg));
		if (flag) {
			throw err;
		}
		return err;
	},
	part: function(path, msg, flag) {
		var err = new Error(util.format('%s %s', path, msg));
		if (flag) {
			throw err;
		}
		return err;
	}
};
