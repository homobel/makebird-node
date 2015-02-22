
var clone = require('../../../utils/extend'),
	types = require('../types'),
	Token = require('./token'),
	checkName = require('../../../utils/check-name'),
	error = require('../../../utils/error');

function DefineToken(token, context) {
	Token.call(this);

	this.context = context;
	this.token = token;
	this._token = clone(token);
	this.value = token.value;

	this.checkErrors();
	this.checkDefine();

}

function DefineTokenProto() {

	this.type = types.define;

	this.checkDefine = function() {
		if (checkName(this.value)) {
			error.syntax(this.getPath(), this.getLine(), 'Define can contain letters numbers and underscores only', true);
		}
	};

}

DefineTokenProto.prototype = Token.prototype;
DefineToken.prototype = new DefineTokenProto();

module.exports = DefineToken;
