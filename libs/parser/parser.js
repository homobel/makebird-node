
var path = require('path'),
	extend = require('../utils/extend'),
	defaults = require('./config'),
	PartsFactory = require('./parts/factory');

module.exports = function(config, cb) {

	config = extend(config, defaults);

	var factory = new PartsFactory(config),
		start = Date.now(),
		root;

	try {
		root = factory.get();
		root.handle({isRoot: true});
		cb(null, root, Date.now() - start);
	}
	catch (err) {
		cb(err);
	}

};
