
var packageFile = require('../package.json'),
	makebird = require('../' + packageFile.main);

function buildSingle(projectName, callback) {
	var config = require('./options/' + projectName);

	makebird.build(config, function(err, data, times) {
		if (err) {
			callback(err);
			return;
		}
		callback(null, data, times);
	});
}

module.exports = buildSingle;
