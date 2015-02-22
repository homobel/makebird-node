
var crypto = require('crypto');

module.exports = function(str) {
	return crypto.createHash('sha256').update(str, 'utf8').digest('hex');
};
