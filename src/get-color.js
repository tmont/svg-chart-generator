var colorMap = require('./color-map');

module.exports = function(name, index) {
	var colors = {
		0: 'blue',
		1: 'red',
		2: 'green',
		3: 'yellow',
		4: 'purple',
		5: 'black'
	};

	var color = colors[index];
	return colorMap[name] || colorMap[color] || colorMap.black;
};
