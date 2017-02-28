var fs = require('fs'),
	path = require('path'),
	buildSingle = require('./build-single.js');

var resourcesDir = path.join(__dirname, 'results');

fs.readdir(resourcesDir, function (err, files) {
	files.some(function(file) {
		var fullpath = path.join(resourcesDir, file);
		var content = fs.readFileSync(fullpath, 'utf8');
		var projectName = path.basename(file, '.js');
		var error;

		buildSingle(projectName, function(err, data, times) {
			if (err) {
				console.error(err);
				error = err;
				return;
			}

			var condition = content === data.toString();
			console.assert(condition, 'result not match sample for: ' + projectName);
			if (condition) {
				console.info('project: ' + projectName + ' - ok, parsed: ' + times.parsed + ', processed: ' + times.processed);
			}
		});

		if (error) {
			return true;
		}

	})
});
