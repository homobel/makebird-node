#!/usr/bin/env node

var path = require('path');
var program = require('commander');
var packageFile = require('../package.json');
var makebird = require('../' + packageFile.main);

program
	.version(packageFile.version)
	.option('-f, --file [src]', 'input file')
	.option('-t, --charset', 'input charset')
	.option('-o, --onlyUsed', 'include only used')
	.option('-p, --partExtensions [list]', 'part extensions')
	.option('-c, --copyrightExtensions [list]', 'copyright extensions')
	.parse(process.argv);

if (program.partExtensions) {
	program.partExtensions =  program.partExtensions.split(',').map(function(c) {
		return c.trim();
	});
}

if (program.copyrightExtensions) {
	program.copyrightExtensions =  program.copyrightExtensions.split(',').map(function(c) {
		return c.trim();
	});
}

program.file = path.resolve(program.file);

var config = {
	input: program.file,
	extensions: {
		partExtensions: program.partExtensions || ['.js'],
		copyrightExtensions: program.copyrightExtensions || ['.txt']
	},
	charset: program.charset || 'utf8',
	includeOnlyUsed: program.onlyUsed ? program.onlyUsed === 'true' : true
};

makebird.build(config, function(err, data) {
	if (err) {
		console.log(err);
		return;
	}
	console.log(data);
});
