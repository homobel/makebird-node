
var tokensReg = /(name|info|copyright|part|component|define|base|mind|if|endif)/;

function TokenInfo(info) {

	this.condition = false;
	this.comment = false;

	this.start = 0;
	this.startInner = 0;
	this.end = 0;
	this.endInner = 0;

	this.inline = 0;
	this.line = 0;

	this.spaces = '';

	this.string = '';
	this.stringInner = '';

	this.value = '';
	this.name = '';

}

function TokenInfoProto() {

	this.preparse = function() {

		if (this.comment) {
			this.name = 'comment';
			this.value = this.stringInner;
		}
		else {
			var match = this.stringInner.match(tokensReg);
			if (match) {
				this.name = match[0];
				this.value = this.stringInner.substring(match[0].length).trim();
			}


		}

	};

}

TokenInfo.prototype = new TokenInfoProto();

module.exports = TokenInfo;
