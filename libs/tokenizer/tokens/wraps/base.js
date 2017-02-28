
var clone = require('../../../utils/extend'),
	config = require('../config'),
	types = require('../types'),
	Token = require('./token'),

	separatorChar = config.separatorChar,
	everyChar = config.everyChar,
	parentChar = config.parentChar,

	error = require('../../../utils/error'),
	checkName = require('../../../utils/check-name');

function BaseToken(token, context) {
	Token.call(this);

	this.context = context;
	this.token = token;
	this._token = clone(token);
	this.value = token.value;
	this.split = token.value.split(separatorChar);

	this.checkErrors();
	this.checkNamespaceLength();
	this.checkNamespace();

	// this.transformToReg();
}

function BaseTokenProto() {

	this.type = types.base;

	this.isGeneral = function() {
		return this.split[this.split.length - 1] === everyChar;
	};

	this.isRelative = function() {
		return this.split[0] === parentChar;
	};

	this.getPhysicalNs = function() {
		return this.split.filter(function(c) {
			return c !== everyChar && c !== parentChar;
		});
	};

	this.getPhysicalNsString = function() {
		return this.getPhysicalNs().join(separatorChar);
	};

	this.checkNamespaceLength = function() {

		if (this.split.length < 2) {
			error.syntax(this.getPath(), this.getLine(), 'Namespace must contain at least 2 names', true);
		}

	};

	this.checkNamespace = function() {

		var sl = this.split.length - 1,
			that = this;

		this.split.some(function(c, i) {
			if (c === parentChar) {
				if (i !== 0) {
					error.syntax(that.getPath(), that.getLine(), 'Parents sign can be at first place in namespace only', true);
					return true;
				}
			}
			else if (c === everyChar) {
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

	this.match = function(ns) {
		var baseNs = this.getPhysicalNs();
		var first = baseNs[0];

		var i = ns.indexOf(first);

		if ((i === -1) || (!this.isRelative() && i !== 0)) {
			return false;
		}

		var nsc = ns.slice(i);

		var u = 0;
		var nscl = nsc.length;
		var baseNsl = baseNs.length;

		if (nscl === baseNsl || nscl < baseNsl) {
			for (; u < nscl; u++) {
				if (nsc[u] !== baseNs[u]) {
					return false;
				}
			}

			return true;
		}

		if (nscl > baseNsl && this.isGeneral()) {
			for (; u < baseNsl; u++) {
				if (nsc[u] !== baseNs[u]) {
					return false;
				}
			}

			return true;
		}

		return false;
	};

}

BaseTokenProto.prototype = Token.prototype;
BaseToken.prototype = new BaseTokenProto();

module.exports = BaseToken;
