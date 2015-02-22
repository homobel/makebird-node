
var parse = require('./libs/parser/parser'),
	process = require('./libs/processor/processor');

module.exports = {

	build: function(options, cb) {
		var that = this;
		this.parse(options, function(err, parsed, parsedTime) {
			if (err) {
				cb(err);
				return;
			}

			that.process(parsed, options, function(err, processed, processedTime) {
				if (err) {
					cb(err);
					return;
				}
				cb(null, processed, { parsed: parsedTime, processed: processedTime });
			});
			
		});
	},

	parse: parse,
	process: process

};
