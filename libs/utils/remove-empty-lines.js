
var os = require('os'),
	EOL = os.EOL,
	reg1 = new RegExp('(?:[ \t]+(?:\r\n|\n))+', 'g'),
	reg2 = new RegExp('(?:\r\n|\n){2,}', 'g');

module.exports = function(str) {
	return str.replace(reg1, EOL).replace(reg2, EOL + EOL);
};
