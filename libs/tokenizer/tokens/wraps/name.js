
var clone = require('../../../utils/extend'),
	types = require('../types'),
	Token = require('./token'),
	error = require('../../../utils/error'),
	checkName = require('../../../utils/check-name');

function NameToken(token, context) {
	Token.call(this);

	this.context = context;
	this.token = token;
	this._token = clone(token);
	this.value = token.value;

	this.checkErrors();
	this.checkName();

}

function NameTokenProto() {

	this.type = types.name;

	this.checkName = function() {
		if (checkName(this.value)) {
			error.syntax(this.getPath(), this.getLine(), 'Name can contain letters numbers and underscores only', true);
		}
	};

}

NameTokenProto.prototype = Token.prototype;
NameToken.prototype = new NameTokenProto();

module.exports = NameToken;
