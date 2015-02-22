
var path = require('path');

module.exports = {
	input: path.join(__dirname, '../projects/simple-multipart/script.js'),
	extensions: {
		partExtensions: ['.js'],
		copyrightExtensions: ['.txt']
	},
	charset: 'utf8',
	includeOnlyUsed: true
};
