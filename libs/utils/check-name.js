
var regName = /[a-zA-Z0-9_]+/;

module.exports = function(str) {
	var match = str.match(regName);
	return !match || match[0] !== str;
};
