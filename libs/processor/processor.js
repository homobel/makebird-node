var process = require('./process/process'),
	removeEmptyLines = require('../utils/remove-empty-lines'),
	contextProcess = require('./process/processContext'),
	extend = require('../utils/extend'),
	defaults = require('./config'),
	EOL = require('os').EOL,
	NL = EOL + EOL;

module.exports = function(rootPart, config, cb) {

	config = extend(defaults, config);

	var err = rootPart.hasErrors();

	if (err) {
		return cb(err);
	}

	var copyrightsList = [],
		start = Date.now();

	rootPart.rootContext.checkRequired();

	var res = removeEmptyLines(process(rootPart, config, copyrightsList, contextProcess)),
		copyrights = copyrightsList.join(NL);

	if (copyrights.length) {
		copyrights += NL;
	}

	cb(null, copyrights + res, Date.now() - start);

};
