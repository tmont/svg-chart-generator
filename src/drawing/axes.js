var extend = require('extend');

module.exports = function(context) {
	var xml = context.svg.builder,
		root = context.svg.root,
		d = context.dimensions;

	function drawAxis(color, endPoint) {
		root.append(xml.create('line', extend({
			stroke: color || 'black',
			'stroke-width': 2,
			x1: d.chartOrigin.x,
			y1: d.chartOrigin.y
		}, endPoint)));
	}

	//x axis
	drawAxis(context.params.xAxis.color, { x2: d.chartOrigin.x + d.chartWidth, y2: d.chartOrigin.y });
	drawAxis(context.params.yAxis.color, { x2: d.chartOrigin.x, y2: d.chartOrigin.y - d.chartHeight });
};