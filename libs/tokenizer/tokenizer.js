
var	TokensIterator = require('./iterators/token-iterator'),
	ContextManager = require('./context/context-manager'),
	statuses = require('./iterators/statuses'),
	error = require('../utils/error');

function Tokenizer(source, part, context) {

	this.part = part;
	this.parentContext = context;
	this.contextManager = new ContextManager(part, context);
	this.parseError = null;
	this.source = source;
	this.tokens = [];
	this.tokensLength = 0;

}

function TokenizerProto() {

	this.parseTokens = function() {
		try {
			if (this.source) {

				var iterator = new TokensIterator(this.source);

				for(; iterator.char(); iterator.next()) {
					if (iterator.status === statuses.text) {

						if (iterator.checkSpaces()) {
							continue;
						}
						if (iterator.checkStart()) {
							continue;
						}
						if (iterator.checkEnd(this.tokens)) {
							continue;
						}
						iterator.inline++;

					}
					else if (iterator.status === statuses.spaces) {

						if (!iterator.checkSpaces(true) && !iterator.checkStart()) {
							iterator.spaces = null;
							if (iterator.checkEnd(this.tokens)) {
								continue;
							}
							iterator.inline++;
						}

					}
					else if (iterator.status === statuses.token) {

						if (iterator.checkEnd(this.tokens, true)) {
							continue;
						}
						iterator.inline++;

					}
				}

				this.tokensLength = this.tokens.length;

			}
		}
		catch (e) {
			return e;
		}
	};

	this.organizeTokens = function() {

		try {
			this.contextManager.organize(this.tokens);

			if (!this.contextManager.checkParent()) {
				error.part(this.path, 'Check if/endif pairs', true);
			}

			this.contextManager._tokens = this.contextManager.getInnerTokens();
		}
		catch (e) {
			return e;
		}

	};

	this.parse = function() {

		// reset of properties
		this.parseError = null;
		this.tokens = [];
		this.tokensLength = 0;
		this.contextManager = new ContextManager(this.part, this.parentContext);

		// parsing
		var pError = this.parseTokens(),
			oError = this.organizeTokens();

		this.parseError = pError || oError || null;
	};

	this.hasCopyright = function() {
		return this.contextManager.root.copyrights.length;
	};

	this.getCopyrightPath = function() {
		return this.contextManager.root.copyrights[0].value;
	};

	this.hasErrors = function() {
		return this.parseError !== null;
	};

	this.getError = function() {
		return this.parseError;
	};

	this.updateData = function() {
		this.contextManager.update();
		this.contextManager.checkType();
		this.contextManager.initNamespace();
	};

	this.applySettings = function(settings) {
		if (settings) {
			for (var prop in settings) {
				if (settings.hasOwnProperty(prop)) {
					this.contextManager.root[prop] = settings[prop];
				}
			}
		}
	};

}

Tokenizer.prototype = new TokenizerProto();

module.exports = Tokenizer;
