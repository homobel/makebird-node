
var clone = require('../../../utils/extend'),
	types = require('../types'),
	Token = require('./token');

function InfoToken(token, context) {
	Token.call(this);

	this.context = context;
	this.token = token;
	this._token = clone(token);
	this.value = token.value;

	this.checkErrors();

}

function InfoTokenProto() {

	this.type = types.info;

}

InfoTokenProto.prototype = Token.prototype;
InfoToken.prototype = new InfoTokenProto();

module.exports = InfoToken;
