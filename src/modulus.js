module.exports = function(value, mod) {
	return (mod + (value % mod)) % mod;
};