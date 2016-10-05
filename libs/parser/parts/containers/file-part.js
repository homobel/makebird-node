
var fs = require('fs'),
	path = require('path'),
	types = require('../types'),
	error = require('../../../utils/error'),
	Tokenizer = require('../../../tokenizer/tokenizer');

function FilePart(id, parent, context, factory) {

	this.path = path.normalize(id);
	this.parent = parent || null;
	this.parentContext = context || null;
	this.factory = factory;
	this.config = factory.config;

	this.cyclicRef = false;
	this.exists = false;

	this.error = null;
	this.source = null;
	this.tokenizer = null;
	this.rootContext = null;

}

function FilePartProto() {

	this.type = types.file;

	this.load = function() {
		try {
			this.source = fs.readFileSync(this.path, {
				encoding: this.config.charset
			});
			this.exists = true;
		}
		catch (err) {
			this.source = null;
			this.exists = false;
			this.error = err;
		}

		this.tokenizer = new Tokenizer(this.source, this, this.parentContext);
	};

	this.loadRequired = function() {

		var part = this;

		function processParts(token) {
			token.requiredPart = part.factory.get(token.value, part, token.context, types.file);
			if (token.requiredPart) {
				token.requiredPart.handle({isPart: true, parentToken: token});
			}
		}

		function processCopyrights(token) {
			token.requiredPart = part.factory.get(token.value, part, token.context, types.copyright);
			if (token.requiredPart) {
				token.requiredPart.handle();
			}
		}

		function processComponents(token) {
			token.requiredPart = part.factory.get(token.value, part, token.context, types.file);
			if (token.requiredPart) {
				token.requiredPart.handle({isComponent: true, isRelativeBase: true, parentToken: token});
			}
		}

		function processMindes(token) {
			token.requiredPart = part.factory.get(token.value, part, token.context, types.file);
			if (token.requiredPart) {
				token.requiredPart.handle({isMind: true, parentToken: token});
			}
		}

		this.tokenizer.contextManager.forEach('parts', processParts);
		this.tokenizer.contextManager.forEach('copyrights', processCopyrights);
		this.tokenizer.contextManager.forEach('components', processComponents);
		this.tokenizer.contextManager.forEach('mindes', processMindes);

	};

	this.parse = function() {
		this.tokenizer.parse();
	};

	this.handle = function(settings) {
		this.cyclicRef = this.checkCyclicRefs();
		if (!this.cyclicRef) {
			this.load();
			this.parse();
			if (!this.tokenizer.hasErrors()) {
				this.tokenizer.applySettings(settings);
				this.tokenizer.updateData();
				this.rootContext = this.tokenizer.contextManager.root;
				this.loadRequired();
			}
		}
	};

	this.hasErrors = function() {

		if (this.cyclicRef) {
			return error.part(this.path, 'Cyclic reference detected');
		}

		if (!this.exists) {
			return error.part(this.path, 'File doesn\'t exist');
		}

		if (this.error) {
			return this.error;
		}

		if (this.tokenizer.hasErrors()) {
			return this.tokenizer.getError();
		}

		var possibleError = null;

		function process(c) {
			var err = c.requiredPart.hasErrors();
			if (err) {
				possibleError = err;
			}
			return err;
		}

		if (this.tokenizer.contextManager.some('copyrights', process) ||
				this.tokenizer.contextManager.some('parts', process) ||
					this.tokenizer.contextManager.some('components', process) ||
						this.tokenizer.contextManager.some('mindes', process)) {
			return possibleError;
		}

	};

	this.hasPart = function(path) {
		if (this.path === path) {
			return true;
		}

		if (this.tokenizer.hasCopyright()) {
			if (this.tokenizer.getCopyrightPath() === path) {
				return true;
			}
		}

		function process(c) {
			return c.requiredPart.hasPart(path);
		}

		return this.tokenizer.contextManager.some('parts', process) ||
				this.tokenizer.contextManager.some('components', process) ||
					this.tokenizer.contextManager.some('mindes', process);
	};

	this.checkCyclicRefs = function() {
		var path = this.path;
		return this.someUntilRoot(function(c) {
			return c.path === path;
		});
	};

	this.someUntilRoot = function(fn) {
		var root = this.parent;

		while (root) {
			var flag = fn(root);
			if (flag) {
				return true;
			}

			root = root.parent;
		}

		return false;
	};

}

FilePart.prototype = new FilePartProto();

module.exports = FilePart;
