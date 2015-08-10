module.exports = function(value, mod) {
	if (value === 0) {
		return 0;
	}

	var exp = Math.log(Math.min(value, mod)) / Math.log(10);
	var multiplier = 1;
	if (exp < 0) {
		multiplier = Math.pow(10, Math.abs(Math.round(exp)));
		value = multiplier * value;
		mod = multiplier * mod;
	}

	return ((mod + (value % mod)) % mod) / multiplier;
};