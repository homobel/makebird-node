
var Context = require('./context'),

	// tokens
	NameToken = require('../tokens/wraps/name'),
	InfoToken = require('../tokens/wraps/info'),
	CopyrightToken = require('../tokens/wraps/copyright'),
	CommentToken = require('../tokens/wraps/comment'),
	BaseToken = require('../tokens/wraps/base'),
	MindToken = require('../tokens/wraps/mind'),
	PartToken = require('../tokens/wraps/part'),
	ComponentToken = require('../tokens/wraps/component'),
	DefineToken = require('../tokens/wraps/define'),
	IfToken = require('../tokens/wraps/if'),
	EndIfToken = require('../tokens/wraps/endif'),

	error = require('../../utils/error');

function ContextManager(part, parentContext) {

	this._tokens = [];
	this.part = part;
	this.cursor = new Context(part, parentContext);
	this.root = this.cursor;

}

function ContextManagerProto() {

	// tokenizer helpers

	this.startContext = function(token) {
		var context = new Context(this.part, this.cursor);
		context.start = token;
		this.cursor.context.push(context);
		this.cursor = context;
	};

	this.endContext = function(token) {
		if (this.checkParent()) {
			error.syntax(this.part.path, token.getLine(), 'Illegal endif', true);
		}
		this.cursor.end = token;
		this.cursor = this.cursor.parent;
	};

	this.organize = function(tokens) {
		for (var i = 0, l = tokens.length; i < l; i++) {
			this.addTokenToCursorByTokenInfo(tokens[i]);
		}
	};

	this.addTokenToCursorByTokenInfo = function(tokenInfo) {

		var path = this.part.path,
			cursor = this.cursor,
			token;

		switch (tokenInfo.name) {

			// header
			case 'name':
				token = new NameToken(tokenInfo, cursor);
				this.addTokenToCursor('name', token);
				break;
			case 'info':
				token = new InfoToken(tokenInfo, cursor);
				this.addTokenToCursor('info', token);
				break;
			case 'copyright':
				token = new CopyrightToken(tokenInfo, cursor, path);
				this.addTokenToCursor('copyrights', token);
				break;

			// context
			case 'comment':
				token = new CommentToken(tokenInfo, cursor);
				this.addTokenToCursor('comments', token);
				break;
			case 'base':
				token = new BaseToken(tokenInfo, cursor);
				this.addTokenToCursor('bases', token);
				break;
			case 'mind':
				token = new MindToken(tokenInfo, cursor, path);
				this.addTokenToCursor('mindes', token);
				break;
			case 'part':
				token = new PartToken(tokenInfo, cursor, path);
				this.addTokenToCursor('parts', token);
				break;
			case 'component':
				token = new ComponentToken(tokenInfo, cursor, path);
				this.addTokenToCursor('components', token);
				break;
			case 'define':
				token = new DefineToken(tokenInfo, cursor, path);
				this.addTokenToCursor('defines', token);
				break;
			case 'if':
				token = new IfToken(tokenInfo, cursor);
				this.startContext(token);
				break;
			case 'endif':
				token = new EndIfToken(tokenInfo, cursor);
				this.endContext(token);
				break;

			// error
			default :
				error.syntax(path, tokenInfo.line + 1, 'Invalid token name', true);
				break;
		}

	};

	this.addTokenToCursor = function(name, token) {
		if (name === 'name' || name === 'info') {
			this.cursor[name] = token;
		}
		else {
			this.cursor[name].push(token);
		}
	};

	// iterators

	this.forEach = function(name, fn) {

		function process(context) {
			context[name].forEach(fn);
			context.context.forEach(process);
		}

		process(this.root);

	};

	this.forEachContext = function(fn) {

		function process(context) {
			context.context.forEach(function(c) {
				fn(c);
				process(c);
			});
		}

		process(this.root);

	};

	this.some = function(name, fn) {

		function process(context) {
			var has = context[name].some(fn);
			if (!has) {			
				return context.context.some(function(c) {
					return process(c);
				});
			}
			return has;
		}

		return process(this.root);

	};

	// helpers

	this.checkParent = function() {
		return this.cursor === this.root;
	};

	this.getInnerTokens = function() {

		var res = [],
			name = this.getName(),
			info = this.getInfo();

		if (name) {
			res.push(name);
		}

		if (info) {
			res.push(info);
		}

		function process(c) {
			res.push(c);
		}

		this.forEach('copyrights', process);
		this.forEach('bases', process);
		this.forEach('mindes', process);
		this.forEach('defines', process);
		this.forEach('parts', process);
		this.forEach('components', process);
		this.forEach('comments', process);

		this.forEachContext(function(c) {
			res.push(c.start);
			res.push(c.end);
		});

		return res;
	};

	this.shift = function(token, space) {
		this._tokens.forEach(function(c) {
			if (c._token.start > token.start) {
				c._token.start += space;
				c._token.startInner += space;
				c._token.end += space;
				c._token.endInner += space;
			}
		});
	};

	this.update = function() {
		function update(c) {
			c.update();
		}

		update(this.root);

		this.forEachContext(update);
	};

	this.checkType = function() {
		function update(c) {
			c.checkType();
		}

		update(this.root);

		this.forEachContext(update);
	};

	this.initNamespace = function() {
		function update(c) {
			c.initNamespace();
		}

		update(this.root);

		this.forEachContext(update);
	};

	this.getName = function() {
		return this.root.name;
	};

	this.getInfo = function() {
		return this.root.info;
	};

}

ContextManager.prototype = new ContextManagerProto();

module.exports = ContextManager;
