#!/usr/bin/env node

var path = require('path'),
	program = require('commander'),
	packageFile = require('../package.json'),
	makebird = require('../' + packageFile.main);

program
	.version(packageFile.version)
	.option('-f, --file [src]', 'input file')
	.option('-ch, --charset', 'input charset')
	.option('-ou, --onlyUsed', 'include only used')
	.option('-pe, --partExtensions [list]', 'part extensions')
	.option('-ce, --copyrightExtensions [list]', 'copyright extensions')
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

program.file = path.join(process.cwd(), program.file);

var config = {
	input: program.file,
	extensions: {
		partExtensions: program.partExtensions || ['.js'],
		copyrightExtensions: program.copyrightExtensions || ['.txt']
	},
	charset: program.charset || 'utf8',
	includeOnlyUsed: program.onlyUsed || true
};

makebird.build(config, function(err, data) {
	if (err) {
		console.log(err);
		return;
	}
	console.log(data);
});
