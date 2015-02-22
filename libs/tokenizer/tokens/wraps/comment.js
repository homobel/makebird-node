
var clone = require('../../../utils/extend'),
	types = require('../types'),
	Token = require('./token');

function CommentToken(token, context) {
	Token.call(this);

	this.context = context;
	this.token = token;
	this._token = clone(token);
	this.value = token.value;

}

function CommentTokenProto() {

	this.type = types.comment;

}

CommentTokenProto.prototype = Token.prototype;
CommentToken.prototype = new CommentTokenProto();

module.exports = CommentToken;
