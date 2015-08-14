module.exports = function(value, exp, base) {
	base = base || 10;
	var divider = Math.pow(base, Math.abs(exp));
	if (exp > 0) {
		divider = base;
	}

	return Math.round(value * (divider * base) / base) / divider;
};
