
function process(node, options, copyrights, contextProcess) {
	return contextProcess(node.rootContext, options, node.source, copyrights, process);
}

module.exports = process;
