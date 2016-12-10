var buildSingle = require('./build-single.js'),
	args = [].slice.call(process.argv, 2),
	projectName = args[0];

if (projectName) {

	buildSingle(projectName, function(err, data, times) {
		if (err) {
			console.error(err);
			return;
		}
		console.log(data);
		console.log(times);
	});

}
else {
	console.error('Project name required as firs argument!');
}
