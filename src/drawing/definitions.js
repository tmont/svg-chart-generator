var getColor = require('../get-color');

module.exports = function(context) {
	var xml = context.svg.builder,
		root = context.svg.root,
		defs = xml.create('defs');

	context.params.data.forEach(function(lineData, i) {
		var grad = xml.create('linearGradient', {
			id: 'line-grad-' + i,
			x1: 0,
			x2: 0,
			y1: 0,
			y2: 1
		});

		var color = getColor(lineData.color, i);
		grad.append(xml.create('stop', { offset: '0%', 'stop-color': color[0] }));
		grad.append(xml.create('stop', { offset: '100%', 'stop-color': color[1] }));

		defs.append(grad);
	});

	root.append(defs);
};
