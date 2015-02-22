
function getPreviousDefines(context) {

	var currentContext = context.parent,
		currentStart = context.start || context.parentToken,
		res = [];

	while (currentContext) {

		currentContext.defines.forEach(function(d) {
			if (d.token.start < currentStart.token.start) {
				res.push(d);
			}
		});

		currentStart = currentContext.start || currentContext.parentToken;
		currentContext = currentContext.parent;

	}

	return res;

}

function checkVariables(tree) {

	tree.forEachVariable(function(context) {

		var required = getPreviousDefines(context);

		context.isRequired = required.some(function(c) {
			return c.value === context.nameText;
		});

	});

}

module.exports = checkVariables;
