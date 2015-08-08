var extend = require('extend'),
	getColor = require('../get-color');

module.exports = function(context) {
	var xml = context.svg.builder,
		root = context.svg.root,
		d = context.dimensions,
		xDomain = context.xDomain,
		yDomain = context.yDomain;

	function translatePoint(point) {
		var x = point[0],
			y = point[1];

		x = d.chartOrigin.x + d.chartWidth * ((x - xDomain.min) / xDomain.numSteps) / xDomain.step;
		y = d.chartOrigin.y - d.chartHeight * ((y - yDomain.min) / yDomain.numSteps) / yDomain.step;

		return [ x, y ];
	}

	context.params.data.forEach(function(lineData, i) {
		var realPoints = lineData.values.map(translatePoint);

		var path = realPoints
			.map(function(point, i) {
				return (i === 0 ? 'M' : 'L') + point.join(',');
			});

		var polygonPoints = realPoints
			.concat([
				[ realPoints[realPoints.length - 1][0], d.chartOrigin.y ], //straight down from last point
				[ realPoints[0][0], d.chartOrigin.y ] //straight down from first point
			])
			.map(function(point) {
				return point.join(',');
			})
			.join(' ');

		var color = getColor(lineData.color, i);
		root.append(xml.create('path', {
			d: path.join(' '),
			stroke: color[0],
			'stroke-width': 2,
			fill: 'none',
			filter: 'url(#line-drop-shadow)'
		}));

		if (lineData.area) {
			root.append(xml.create('polygon', {
				points: polygonPoints,
				'stroke-width': 0,
				fill: 'url(#line-grad-' + i + ')',
				'fill-opacity': 0.4
			}));
		}
	});
};