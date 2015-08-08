var extend = require('extend');

module.exports = function(context) {
	var xml = context.svg.builder,
		root = context.svg.root,
		d = context.dimensions,
		xAxis = context.params.xAxis,
		yAxis = context.params.yAxis,
		defaults = {
			'font-size': 16,
			'font-family': context.params.style.fontFamily,
			'text-anchor': 'middle'
		};

	function addTextNode(label, transform, attributes) {
		if (transform) {
			attributes.transform = 'rotate(270,' + attributes.x + ',' + attributes.y + ')';
		}
		label && root.append(xml.create('text', extend(attributes, defaults)).append(label));
	}

	addTextNode(xAxis.label, false, {
		x: d.chartOrigin.x + (d.chartWidth / 2),
		y: d.chartOrigin.y + d.xAxisGutter + (d.xAxisLabelHeight * 3 / 4)
	});

	addTextNode(yAxis.label, true, {
		x: d.margin + (d.yAxisLabelWidth * 3 / 4),
		y: d.margin + d.titleHeight + (d.chartHeight / 2)
	});
};