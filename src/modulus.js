var roundProperly = require('./round');

module.exports = function(value, mod) {
	if (value === 0) {
		return 0;
	}

	var base = 10;
	var exp = Math.log(Math.min(Math.abs(value), mod)) / Math.log(base);
	var multiplier = 1;
	if (exp < 0) {
		multiplier = Math.pow(base, Math.abs(Math.round(exp)));
		value = multiplier * value;
		mod = multiplier * mod;
	}

	var result = ((mod + (value % mod)) % mod) / multiplier;
	return roundProperly(result, Math.abs(Math.floor(exp)) + 1, base);
};