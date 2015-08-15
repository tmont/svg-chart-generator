var extend = require('extend');

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
		stepValue,
		i;

	//x-axis
	for (i = 0; i < xDomain.stepValues.length; i++) {
		stepValue = xDomain.stepValues[i];
		coord = {
			x: d.chartOrigin.x + ((stepValue - xDomain.min) * xDomain.pixelsPerUnit),
			y: d.chartOrigin.y + (d.xAxisGutter * 3 / 4)
		};

		g.append(xml.create('text', {
			x: coord.x,
			y: coord.y,
			'text-anchor': 'end',
			transform: 'rotate(' + (d.axisLabelAngle || 0) + ', ' + coord.x + ',' + coord.y + ')'
		}).append(xDomain.labels[i]));

		if (stepValue > xDomain.min && context.params.xAxis.grid) {
			g.append(xml.create('line', extend({
				x1: coord.x,
				y1: d.margin + d.titleHeight + d.chartHeight,
				x2: coord.x,
				y2: d.margin + d.titleHeight
			}, gridDefaults)));
		}
	}

	//y-axis
	for (i = 0; i < yDomain.stepValues.length; i++) {
		stepValue = yDomain.stepValues[i];
		coord = {
			x: d.margin + d.yAxisLabelWidth + (d.yAxisGutter / 2),
			y: d.chartOrigin.y - ((stepValue - yDomain.min) * yDomain.pixelsPerUnit)
		};

		g.append(xml.create('text', {
			x: coord.x,
			y: coord.y,
			'text-anchor': 'middle',
			dy: '.3em'
		}).append(stepValue));

		if (i > yDomain.min && context.params.yAxis.grid) {
			g.append(xml.create('line', extend({
				x1: d.chartOrigin.x,
				y1: d.chartOrigin.y - ((stepValue - yDomain.min) * yDomain.pixelsPerUnit),
				x2: d.chartOrigin.x + d.chartWidth,
				y2: d.chartOrigin.y - ((stepValue - yDomain.min) * yDomain.pixelsPerUnit)
			}, gridDefaults)));
		}
	}

	root.append(g);
};