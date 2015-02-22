
var makebird = require('../index.js'),
	args = [].slice.call(process.argv, 2),
	projectName = args[0];

if (projectName) {

	var config;

	try {
		config = require('./options/' + projectName);
	}
	catch (err) {
		console.error('There is no config for such project!');
	}

	var start = Date.now();

	makebird.build(config, function(err, data, times) {
		if (err) {
			console.log(err);
			return;
		}
		console.log(data);
		console.log(times);
	});

}
else {
	console.error('Project name required as firs argument!');
}
