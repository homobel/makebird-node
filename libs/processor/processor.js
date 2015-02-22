var process = require('./process/process'),
	removeEmptyLines = require('../utils/remove-empty-lines'),
	contextProcess = require('./process/processContext'),
	EOL = require('os').EOL,
	NL = EOL + EOL;

module.exports = function(rootPart, options, cb) {

	var err = rootPart.hasErrors();

	if (err) {
		return cb(err);
	}

	var copyrightsList = [],
		start = Date.now();

	rootPart.rootContext.checkRequired();

	var	res = removeEmptyLines(process(rootPart, options, copyrightsList, contextProcess)),
		copyrights = copyrightsList.join(NL);

	if (copyrights.length) {
		copyrights += NL;
	}

	cb(null, copyrights + res, Date.now() - start);

};
