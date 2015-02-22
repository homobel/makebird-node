
var path = require('path'),
	clone = require('../../../utils/extend'),
	types = require('../types'),
	Token = require('./token');

function MindToken(token, context, p) {
	Token.call(this);

	this.context = context;
	this.token = token;
	this._token = clone(token);
	this.value = path.normalize(path.dirname(p) + '/' + token.value);

	this.checkErrors();
	this.checkValueHasExtension();

}

function MindTokenProto() {

	this.type = types.mind;
	this.isShadow = true;

}

MindTokenProto.prototype = Token.prototype;
MindToken.prototype = new MindTokenProto();

module.exports = MindToken;
