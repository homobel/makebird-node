
var clone = require('../../../utils/extend'),
	types = require('../types'),
	config = require('../config'),
	Token = require('./token'),

	separatorChar = config.separatorChar,
	everyChar = config.everyChar,
	internalChar = config.internal,

	error = require('../../../utils/error'),
	checkName = require('../../../utils/check-name');

function IfToken(token, context) {
	Token.call(this);

	this.context = context;
	this.token = token;
	this._token = clone(token);
	this.value = token.value

	this.isVariable = false;
	this.isBase = false;
	this.isRelativeBase = false;
	this.isFinishedBase = false;

	var split = token.value.split(separatorChar);

	this.split = split;

	if (!split.length) {
		error.syntax(this.getPath(), this.getLine(), 'Expression didn\'t found', true);
	}

	if (split.length === 1) {
		this.isVariable = true;
	}
	else {
		this.isBase = true;
		if (split[0] === internalChar) {

			this.checkRelativeNamespace();

			this.isRelativeBase = true;
		}
		else if (split[split.length - 1] === everyChar) {
			this.isFinishedBase = true;
		}
	}

	this.checkNamespace();

}

function IfTokenProto() {

	this.type = types.if;

	this.checkRelativeNamespace = function() {
		if (this.split.length !== 2) {
			error.syntax(this.getPath(), this.getLine(), 'Relative expression must contain 2 words', true);
		}
	};

	this.checkNamespace = function() {

		var sl = this.split.length - 1,
			that = this;

		this.split.some(function(c, i) {
			if (c === everyChar) {
				if (i !== sl) {
					error.syntax(that.getPath(), that.getLine(), 'Module sign can be at last place in namespace only', true);
					return true;
				}
			}
			else if (checkName(c)) {
				error.syntax(that.getPath(), that.getLine(), 'Namespace can contain special signs letters numbers and underscores only', true);
				return true;
			}
		});
	};

}

IfTokenProto.prototype = Token.prototype;
IfToken.prototype = new IfTokenProto();

module.exports = IfToken;
