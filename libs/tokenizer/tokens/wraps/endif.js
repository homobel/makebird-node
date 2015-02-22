
var clone = require('../../../utils/extend'),
	types = require('../types'),
	Token = require('./token');

function EndIfToken(token, context) {
	Token.call(this);

	this.context = context;
	this.token = token;
	this._token = clone(token);

}

function EndIfTokenProto() {

	this.type = types.endif;

}

EndIfTokenProto.prototype = Token.prototype;
EndIfToken.prototype = new EndIfTokenProto();

module.exports = EndIfToken;
