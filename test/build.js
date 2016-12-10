
var fs = require('fs'),
	buildSingle = require('./build-single'),
	args = Array.prototype.slice.call(process.argv, 2),
	projectName = args[0];

if (projectName) {

	buildSingle(projectName, function(err, data, times) {
		if (err) {
			console.error(err.message);
			return;
		}

		fs.writeFileSync('results/' + projectName + '.js', data);
		console.info(times);
	});

}
else {
	console.error('Project name required as firs argument!');
}
