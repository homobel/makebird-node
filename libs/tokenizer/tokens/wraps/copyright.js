
var path = require('path'),
	clone = require('../../../utils/extend'),
	types = require('../types'),
	Token = require('./token');

function CopyrightToken(token, context, p) {
	Token.call(this);

	this.context = context;
	this.token = token;
	this._token = clone(token);
	this.value = path.normalize(path.dirname(p) + '/' + token.value);

	this.checkErrors();
	this.checkValueHasExtension();

}

function CopyrightTokenProto() {

	this.type = types.copyright;

}

CopyrightTokenProto.prototype = Token.prototype;
CopyrightToken.prototype = new CopyrightTokenProto();

module.exports = CopyrightToken;
