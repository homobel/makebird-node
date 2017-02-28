
function contextHasBase(context, bases) {

	if (!context.hasNamespace() || context.isAnonymous) {
		return false;
	}

	return bases.some(function(base) {
		return base.match(context.namespace);
	});

}

function isRequiredContext(context) {
	return context.isRequired || context.isRoot || context.isPart;
}

function isParentsRequired(context) {
	while (context = context.parent) {
		if (!isRequiredContext(context)) {
			return false;
		}
	}
	return true;
}

function isNotRequiredComponentWithRequiredParent(context) {
	return (!context.isRequired && !context.isRoot && !context.isPart) &&
			context.isComponent &&
			isParentsRequired(context);
}

function setAsRequired(context) {
	context.isRequired = true;
}

function checkBases(tree) {
	var bases = [];

	// collect bases from open contexts
	tree.forEachBase(function(context) {
		bases = bases.concat(context.bases);
	}, isRequiredContext);

	// update closed contexts
	return tree.forEachBase(function(context) {
		if (contextHasBase(context, bases)) {
			context.untilRoot(setAsRequired);
			return true;
		}
	}, isNotRequiredComponentWithRequiredParent);

}

module.exports = checkBases;
