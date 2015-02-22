
var path = require('path'),
	clone = require('../../../utils/extend'),
	types = require('../types'),
	Token = require('./token');

function ComponentToken(token, context, p) {
	Token.call(this);

	this.context = context;
	this.token = token;
	this._token = clone(token);
	this.value = path.normalize(path.dirname(p) + '/' + token.value);

	this.checkErrors();
	this.checkValueHasExtension();

}

function ComponentTokenProto() {

	this.type = types.component;

}

ComponentTokenProto.prototype = Token.prototype;
ComponentToken.prototype = new ComponentTokenProto();

module.exports = ComponentToken;
