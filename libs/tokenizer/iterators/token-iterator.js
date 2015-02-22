
var TokenInfo = require('../tokens/token-info'),
	path = require('path'),
	config = require('./config'),
	statuses = require('./statuses'),

	start = config.start,
	comment = config.comment,
	newLine = config.newLine,
	spaces = config.spaces,
	condition = config.condition;

function TokensIterator(str) {

	this.string = str;
	this.index = 0;

	this.status = statuses.text;
	this.line = 0;
	this.inline = 0;
	this.spaces = '';

	this.token  = new TokenInfo();

}

function TokensIteratorProto() {

	// cursor

	this.next = function() {
		this.index++;
	};

	// char operating

	this.char = function(index) {
		return this.string[index || this.index];
	};

	this.charIs = function(val, index) {
		return !!~this.string[index || this.index].search(val);
	};

	// chunk operation

	this.getChunk = function(i, l) {
		if (l === undefined) {
			l = i;
			i = this.index;
		}
		return this.string.substr(i, l);
	};

	this.checkStartByChunk = function(n, regexp) {
		var isStart = ~this.getChunk(n).search(regexp);

		if (isStart) {
			this.token.spaces = this.spaces;
			this.token.start = this.index;
			this.token.startInner = this.index + n;
			this.token.line = this.line;
			this.token.inline = this.inline;

			this.status = statuses.token;
			this.spaces = '';
			this.index += n;
			this.inline += n;
			return true;
		}
	};

	this.checkStart = function() {
		var flag = this.checkStartByChunk(3, start);
		if (!flag) {
			flag = this.checkStartByChunk(4, comment);
			if (flag) {
				this.token.comment = true;
			}
		}
		return flag;
	};

	this.checkSpaces = function(next) {

		var isSpaces = this.charIs(spaces);
		if (!this.inline && isSpaces) {
			this.status = statuses.spaces;
			this.spaces += this.char();
			this.inline += 1;
			return true;
		}
		if (isSpaces && next) {
			this.spaces += this.char();
			this.inline += 1;
			return true;
		}
		this.status = statuses.text;

	};

	this.checkEnd = function(tokens, command) {
		var str = this.getChunk(2),
			match = str.match(newLine),
			EOF = str.length < 2,

			token = this.token;

		if (EOF || (match && match[0])) {

			var l = EOF ? str.length : match[0].length,
				li = EOF ? 0 : l,
				ls = l - 1;

			this.index += ls;
			this.inline += ls;

			if (command) {
				token.end = this.index;
				token.endInner = this.index - li;

				var tokenEnd = token.end - token.start + 1,
					tokenEndInner =  token.endInner - token.startInner + 1;

				token.string = this.getChunk(token.start, tokenEnd);
				token.stringInner = this.getChunk(token.startInner, tokenEndInner).trim();
				token.condition = !!~token.stringInner.search(condition);
				token.preparse();

				tokens.push(token);

				this.token = new TokenInfo();
			}

			this.line++;
			this.inline = 0;
			this.spaces = '';
			this.status = statuses.text;

			return true;
		}
	};

}

TokensIterator.prototype = new TokensIteratorProto();

module.exports = TokensIterator;
