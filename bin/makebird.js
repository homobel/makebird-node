#!/usr/bin/env node

var fs = require('fs'),
	path = require('path'),
	program = require('commander'),
	packageFile = require('../package.json'),
	makebird = require('../' + packageFile.main);

function list(value) {
	return value.split(',');
}

function commanderLikeError(msg) {
	console.error();
	console.error('  error: ' + msg);
	console.error();
	process.exit(1);
}

function resolve(value) {
	if (typeof value === 'string') {
		value = path.resolve(value);
		try {
			fs.accessSync(value, fs.F_OK);
			return value;
		} catch (e) {
			commanderLikeError('input file not exists');
		}
	}
	commanderLikeError('input file not specified');
}

program
	.version(packageFile.version)
	.usage('[options] <file ...>')
	.option('-t --charset <charset>', 'input files charset', 'utf8')
	.option('-o --no-onlyUsed', 'include only used contexts')
	.option('-p --partExtensions [list]', 'allowed extensions', list, ['.js'])
	.option('-c --copyrightExtensions [list]', 'copyright extensions', list, ['.txt'])
	.parse(process.argv);

var config = {
		input: resolve(program.args[0]),
		extensions: {
			partExtensions: program.partExtensions,
			copyrightExtensions: program.copyrightExtensions
		},
		charset: program.charset,
		includeOnlyUsed: program.onlyUsed
	};

makebird.build(config, function(err, data) {
	if (err) {
		console.log(err);
		return;
	}
	console.log(data);
});
