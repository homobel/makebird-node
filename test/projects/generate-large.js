
var path = require('path'),
	fs = require('fs'),
	os = require('os'),
	EOL = os.EOL,
	items = 1000;

function generate(name) {

	var p = path.join(__dirname, 'large');

	function getName(i) {
		return name + i;
	}

	for (var i = 0; i < items; i++) {

		var iname = getName(i),
			res = '';

		res += '//~ name ' + iname + EOL + EOL;
		res += 'alert(' + iname + ');' + EOL + EOL;

		if (i !== items - 1) {


			res += '//~ component ' + getName(i + 1) + '.js' + EOL + EOL;
		}

		fs.writeFileSync(path.join(p, iname + '.js'), res);

	}

}

generate('a');
generate('b');
generate('c');
//generate('d');
//generate('e');
//generate('f');
