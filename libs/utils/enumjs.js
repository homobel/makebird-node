
module.exports = function(arr) {

	arr.forEach(function(c, i ,a) {
		a[c] = i;
	});

	return arr;

};
