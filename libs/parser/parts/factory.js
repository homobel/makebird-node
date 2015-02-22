
var path = require('path'),
	types = require('./types'),
	FilePart = require('./containers/file-part'),
	CopyrightPart = require('./containers/copyright-part'),
	error = require('../../utils/error');

function PartsFactory(config) {

	this.config = config;

}

function PartsFactoryProto() {

	this.get = function(id, parent, context, type) {

		id = id || this.config.input;

		var idExtension = path.extname(id),
			extensions = this.config.extensions,
			isFile = false,
			isCopyright = false,
			factory = this;

		if (idExtension.length && type === undefined) {
			isFile = ~extensions.partExtensions.indexOf(idExtension);
			isCopyright = ~extensions.copyrightExtensions.indexOf(idExtension);
		}
		else {
			isFile = type === types.file;
			isCopyright = type === types.copyright;
		}

		if (isFile) {
			return new FilePart(id, parent, context, factory);
		}
		else if (isCopyright) {
			return new CopyrightPart(id, parent, context, factory);
		}
		error.part(id, 'Unknown type', true)

	};

}

PartsFactory.prototype = new PartsFactoryProto();

module.exports = PartsFactory;
