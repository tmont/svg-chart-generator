var extend = require('extend'),
	roundProperly = require('../round');

module.exports = function(context) {
	var xml = context.svg.builder,
		root = context.svg.root,
		d = context.dimensions,
		xDomain = context.xDomain,
		yDomain = context.yDomain;

	var gridDefaults = {
		stroke: 'black',
		'stroke-opacity': 0.2,
		'stroke-width': 1
	};

	var g = xml.create('g', {
		'font-size': 14,
		'font-family': context.params.style.fontFamily
	});

	var coord,
		i;

	//x-axis
	for (i = xDomain.min; i <= xDomain.max; i += xDomain.step) {
		i = roundProperly(i, xDomain.exp, 10);
		coord = {
			x: d.chartOrigin.x + ((i - xDomain.min) * xDomain.stepLength),
			y: d.chartOrigin.y + (d.xAxisGutter * 3 / 4)
		};

		g.append(xml.create('text', {
			x: coord.x,
			y: coord.y,
			'text-anchor': 'middle'
		}).append(i));

		if (i > xDomain.min && context.params.xAxis.grid) {
			g.append(xml.create('line', extend({
				x1: d.chartOrigin.x + ((i - xDomain.min) * xDomain.stepLength),
				y1: d.margin + d.titleHeight + d.chartHeight,
				x2: d.chartOrigin.x + ((i - xDomain.min) * xDomain.stepLength),
				y2: d.margin + d.titleHeight
			}, gridDefaults)));
		}
	}

	//y-axis
	for (i = yDomain.min; i <= yDomain.max; i += yDomain.step) {
		i = roundProperly(i, yDomain.exp, 10);
		coord = {
			x: d.margin + d.yAxisLabelWidth + (d.yAxisGutter / 2),
			y: d.chartOrigin.y - ((i - yDomain.min) * yDomain.stepLength)
		};

		g.append(xml.create('text', {
			x: coord.x,
			y: coord.y,
			'text-anchor': 'middle',
			dy: '.3em'
		}).append(i));

		if (i > yDomain.min && context.params.yAxis.grid) {
			g.append(xml.create('line', extend({
				x1: d.chartOrigin.x,
				y1: d.chartOrigin.y - ((i - yDomain.min) * yDomain.stepLength),
				x2: d.chartOrigin.x + d.chartWidth,
				y2: d.chartOrigin.y - ((i - yDomain.min) * yDomain.stepLength)
			}, gridDefaults)));
		}
	}

	root.append(g);
};