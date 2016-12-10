
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
	return tree.forEachVariable(function(context) {

		if (!context.isRequired) {

			var defines = getPreviousDefines(context);

			context.isRequired = defines.some(function(c) {
				return c.value === context.nameText;
			});

			if (context.isRequired) {
				return true;
			}

		}

	});

}

module.exports = checkVariables;
