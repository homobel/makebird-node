
function contextHasBase(context, bases) {

	if (!context.hasNamespace() || context.isAnonymous) {
		return false;
	}

	return bases.some(function(base) {
		return base.reg.test(context.namespaceStr);
	});

}

function isRequiredContext(context) {
	return context.isRequired || context.isRoot || context.isPart;
}

function isNotRequiredContext(context) {
	return !context.isRequired && !context.isRoot && !context.isPart;
}

function setAsRequired(context) {
	context.isRequired = true;
}

function checkBasesOnce(tree) {

	var repeat = false,
		bases = [];

	// collect bases from open contexts
	tree.forEachBase(function(context) {
		bases = bases.concat(context.bases);
	}, isRequiredContext);

	// update closed contexts
	tree.forEachBase(function(context) {
		if (contextHasBase(context, bases)) {
			context.untilRoot(setAsRequired);
			repeat = true;
		}
	}, isNotRequiredContext, true);

	return repeat;

}

function checkBases(tree) {
	while (checkBasesOnce(tree)) {}
}

module.exports = checkBases;
