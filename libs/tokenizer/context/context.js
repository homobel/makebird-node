
var config = require('../tokens/config'),
	separatorChar = config.separatorChar,
	hash = require('../../utils/hash'),
	checkBases = require('../checker/check-bases'),
	checkVariables = require('../checker/check-variables');

function Context(part, parent) {

	this.part = part;

	this.start = null;
	this.end = null;

	this.parent = parent || null;
	this.parentToken = null;
	this.context = [];

	this.name = null;
	this.info = null;

	this.nameText = '';
	this.infoText = '';

	this.copyrights = [];

	this.bases = [];
	this.mindes = [];
	this.defines = [];
	this.parts = [];
	this.components = [];
	this.comments = [];

	this.isAnonymous = false;
	this.isRoot = false;
	this.isVariable = false;

	this.isComponent = false;
	this.isPart = false;
	this.isMind = false;

	this.isRequired = false;
	this.isRelativeBase = false;

	this.namespace = [];
	this.namespaceStr = '';

}

function ContextProto() {

	this.update = function() {
		this.updateName();
		this.updateInfo();
	};

	this.updateName = function() {
		if (this.name) {
			this.nameText = this.name.value;
		}
		else if (this.start) {
			if (this.start.isVariable) {
				this.nameText = this.start.value;
			}
			else if (this.start.isBase) {
				if (this.start.isRelativeBase) {
					this.nameText = this.start.split[1];
				}
			}
		}
		else {
			this.isAnonymous = true;
			this.nameText = hash(this.part.path);
		}
	};

	this.updateInfo = function() {
		if (this.info) {
			this.infoText = this.info.value;
		}
		else {
			this.infoText = this.part.path;
		}
	};

	this.checkType = function() {
		if (this.isMind) {
			this.isComponent = true;
			this.isRequired = true;
		}
		else if (this.start) {
			if (this.start.isVariable) {
				this.isVariable = true;
			}
			else if (this.start.isBase) {
				this.isComponent = true;
			}
		}
	};

	this.initNamespace = function() {
		if (this.isComponent) {
			var context = this,
				res;

			if (context.parent && !context.isMind && this.isBaseRelated()) {
				res = context.parent.namespace.slice(0);
				res.push(context.nameText);
			}
			else if (this.start && !this.isBaseRelated()) {
				res = this.start.split;
			}
			else {
				res = [context.nameText];
			}

			this.namespace = res;
			this.namespaceStr = res.join(separatorChar);
		}
	};

	this.forEachBase = function(cb, condition) {

		function processPartToken(token) {
			process(token.requiredPart.tokenizer.contextManager.root);
		}

		function process(context) {

			var res;

			if (condition) {
				if (condition(context)) {
					res = cb(context);
				}
			}
			else {
				res = cb(context);
			}

			if (res) {
				return true;
			}

			context.context.some(process);
			context.parts.some(processPartToken);
			context.components.some(processPartToken);
			context.mindes.some(processPartToken);
		}

		process(this);

	};

	this.forEachVariable = function(cb) {

		this.forEachBase(cb, function(c) {
			return c.isVariable;
		});

	};

	this.forEachComponent = function(cb) {

		this.forEachBase(cb, function(c) {
			return c.isComponent;
		});

	};

	this.getFakeToken = function() {
		return {
			start: this.start._token.start,
			end: this.end._token.end
		};
	};

	this.getLength = function() {
		return this.end._token.end - this.start._token.start  + 1; // wtf ??
	};

	this.isBaseRelated = function() {
		return this.start && this.start.isRelativeBase || this.isRelativeBase;
	};

	this.untilRoot = function(fn) {
		var context = this;

		while (context) {
			fn(context);

			context = context.parent;
		}

	};

	this.checkRequired = function() {
		checkVariables(this);
		checkBases(this);
	};

	this.reset = function() {

		this.forEachBase(function(c) {
			c.isRequired = false;

			function process(t) {
				if (t) {
					t.reset();
				}
			}

			process(c.name);
			process(c.info);

			c.copyrights.forEach(process);
			c.bases.forEach(process);
			c.mindes.forEach(process);
			c.defines.forEach(process);
			c.parts.forEach(process);
			c.components.forEach(process);
			c.comments.forEach(process);

		});

	};

	this.hasNamespace = function() {
		return this.namespace.length > 0;
	};

	this.isAnonymous = function() {
		return !this.isRoot && this.namespace.length < 2;
	};

}

Context.prototype = new ContextProto();

module.exports = Context;
