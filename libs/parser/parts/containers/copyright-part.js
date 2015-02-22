
var FilePart = require('./file-part'),
	types = require('../types'),
	noop = require('../../../utils/noop'),
	error = require('../../../utils/error');

function CopyrightPart(id, parent, context, factory) {
	FilePart.call(this, id, parent, context, factory);
}

function CopyrightPartProto() {

	this.type = types.copyright;

	this.parse = noop;
	this.loadRequired = noop;

	this.hasErrors = function() {
		if (!this.exists) {
			return error.part(this.path, 'Copyright doesn\'t exist');
		}
	};

}

CopyrightPartProto.prototype = FilePart.prototype;
CopyrightPart.prototype = new CopyrightPartProto();

module.exports = CopyrightPart;
