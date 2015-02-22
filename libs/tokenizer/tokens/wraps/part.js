
var path = require('path'),
	clone = require('../../../utils/extend'),
	types = require('../types'),
	Token = require('./token');

function PartToken(token, context, p) {
	Token.call(this);

	this.context = context;
	this.token = token;
	this._token = clone(token);
	this.value = path.normalize(path.dirname(p) + '/' + token.value);

	this.checkErrors();
	this.checkValueHasExtension();

}

function PartTokenProto() {

	this.type = types.part;

}

PartTokenProto.prototype = Token.prototype;
PartToken.prototype = new PartTokenProto();

module.exports = PartToken;
