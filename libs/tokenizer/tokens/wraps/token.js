
var clone = require('../../../utils/extend'),
	error = require('../../../utils/error'),
	path = require('path')

function Token() {

}

function TokenProto() {

	this.type = 'token';
	this.isShadow = false;

	this.checkErrors = function() {

		if (!this.token.value) {
			error.syntax(this.getPath(), this.getLine(), 'Token value can\'t be empty', true);
		}

	};

	this.checkValueHasExtension = function() {
		var ext = path.extname(this.value);
		if (!ext) {
			error.syntax(this.getPath(), this.getLine(), 'Path must contain extension', true);
		}
	};

	this.getLine = function() {
		return this._token.line + 1;
	};

	this.getPath = function() {
		return this.context.part.path;
	};

	this.reset = function() {
		this._token = clone(this.token);
	};

}

Token.prototype = new TokenProto();

module.exports = Token;
