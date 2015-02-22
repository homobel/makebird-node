
var os = require('os'),
	EOL = os.EOL;

function replace(str, token, val) {
	return str.substr(0, token.start) + (val || '') + str.substr(token.end + 1);
}

function removeToken(token, res, cm, r) {
	var rl = (r && r.length) || 0;
	cm.shift(token, rl - token.string.length);
	return replace(res, token, r);
}

function removeContextToken(token, res, cm) {
	cm.shift(token, EOL.length - token.string.length);
	return replace(res, token, EOL);
}

function removeContext(c, res, cm) {
	cm.shift(c.end._token, EOL.length - c.getLength());
	return replace(res, c.getFakeToken(), EOL);
}

module.exports = {
	removeToken: removeToken,
	removeContext: removeContext,
	removeContextToken: removeContextToken
};
