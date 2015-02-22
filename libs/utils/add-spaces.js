
var os = require('os'),
	regNL = /(?:\r\n|\n)/,
	EOL = os.EOL;

module.exports = function(str, spaces) {

	return str.split(regNL).map(function(line) {
		return spaces + line;
	}).join(EOL);

};
