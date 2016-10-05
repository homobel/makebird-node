
var remover = require('./remove'),
	addSpaces = require('../../utils/add-spaces'),
	removeToken = remover.removeToken,
	removeContext = remover.removeContext,
	removeContextToken = remover.removeContextToken;

function contextProcess(context, options, res, copyrights, process) {

	var cm = context.part.tokenizer.contextManager;

	// contexts
	context.context.forEach(function(c) {
		if (options.includeOnlyUsed) {
			if (c.isRequired) {
				res = removeContextToken(c.start._token, res, cm);
				res = removeContextToken(c.end._token, res, cm);
				res = contextProcess(c, options, res, copyrights, process);
			}
			else {
				res = removeContext(c, res, cm);
			}
		}
		else {
			res = removeContextToken(c.start._token, res, cm);
			res = removeContextToken(c.end._token, res, cm);
			res = contextProcess(c, options, res, copyrights, process);
		}
	});

	// name
	if (context.name) {
		res = removeToken(context.name._token, res, cm);
	}

	// info
	if (context.info) {
		res = removeToken(context.info._token, res, cm);
	}

	// copyrights
	context.copyrights.forEach(function(c) {
		copyrights.push(c.requiredPart.source);
		res = removeToken(c._token, res, cm);
	});

	// bases
	context.bases.forEach(function(c) {
		res = removeToken(c._token, res, cm);
	});

	// mindes
	context.mindes.forEach(function(c) {
		res = removeToken(c._token, res, cm);
	});

	// definitions
	context.defines.forEach(function(c) {
		res = removeToken(c._token, res, cm);
	});

	// parts
	context.parts.forEach(function(c) {
		res = removeToken(c._token, res, cm, addSpaces(process(c.requiredPart, options, copyrights, contextProcess), c._token.spaces));
	});

	// components
	context.components.forEach(function(c) {
		var r;
		if (options.includeOnlyUsed) {
			if (c.requiredPart.rootContext.isRequired) {
				r = addSpaces(process(c.requiredPart, options, copyrights, contextProcess), c.token.spaces);
			}
		}
		else {
			r = addSpaces(process(c.requiredPart, options, copyrights, contextProcess), c.token.spaces);
		}
		res = removeToken(c._token, res, cm, r);
	});

	// comments
	context.comments.forEach(function(c) {
		res = removeToken(c._token, res, cm);
	});

	return res;

}

module.exports = contextProcess;
