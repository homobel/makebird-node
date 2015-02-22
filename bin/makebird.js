#!/usr/bin/env node

var fs = require('fs'),
	path = require('path'),
	program = require('commander'),
	package = require('../package.json'),
	makebird = require('../' + package.main);

program
	.version(package.version)
	.option('-f, --file [src]', 'input file')
	.option('-ch, --charset', 'input charset')
	.option('-ou, --onlyUsed', 'include only used')
	.option('-pe, --partExtensions [list]', 'part extensions')
	.option('-ce, --copyrightExtensions [list]', 'copyright extensions')
	.parse(process.argv);

if (program.partExtensions) {
	program.partExtensions =  program.partExtensions.split(',');
}

if (program.copyrightExtensions) {
	program.copyrightExtensions =  program.copyrightExtensions.split(',');
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

makebird.build(config, function(err, data, times) {
	if (err) {
		console.log(err);
		return;
	}
	console.log(data);
});
