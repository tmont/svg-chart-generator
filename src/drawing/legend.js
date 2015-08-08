var extend = require('extend');

module.exports = function(context) {
	if (!context.params.legend) {
		return;
	}

	var xml = context.svg.builder,
		root = context.svg.root,
		d = context.dimensions;

	var legend = {
		x: d.chartOrigin.x + d.chartWidth,
		y: d.margin + d.titleHeight
	};

	context.params.data.forEach(function(lineData, i) {
		var padding = d.margin / 2,
			rectWidth = 20,
			rectHeight = 20,
			x = legend.x + padding,
			y = legend.y + padding + (i * rectHeight * 1.5);

		root.append(xml.create('rect', {
			x: x,
			y: y,
			rx: 2,
			ry: 2,
			width: rectWidth,
			height: rectHeight,
			fill: 'url(#line-grad-' + i + ')'
		}));

		var lineLabel = xml.create('text', {
			x: x + rectWidth + padding,
			y: y + (rectHeight * 3 / 4),
			'font-family': context.params.style.fontFamily,
			'font-size': 14
		});
		lineLabel.append(lineData.label || '???');
		root.append(lineLabel);
	});
};