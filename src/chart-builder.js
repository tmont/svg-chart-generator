var extend = require('extend'),
	drawing = require('./drawing'),
	getOptimalDomain = require('./domain'),
	XmlBuilder = require('./xml-builder');

var defaultOptions = {
	type: 'line',
	width: 600,
	height: 350,
	yAxis: {
		color: 'black',
		grid: true
	},
	xAxis: {
		color: 'black',
		grid: true
	},
	style: {
		fontFamily: 'monospace'
	}
};

function ChartBuilder() {

}

ChartBuilder.prototype = {
	build: function(options) {
		var params = extend(true, {}, defaultOptions, options);

		if (params.type !== 'line') {
			throw new Error('Unknown chart type');
		}
		if (!Array.isArray(params.data)) {
			throw new Error('data must be an array of objects');
		}

		function pluck(values, index) {
			return values.reduce(function(values, next) {
				next.values.forEach(function(point) {
					values.push(point[index]);
				});
				return values;
			}, []);
		}

		var context = {
			params: params,
			dimensions: {},
			xDomain: getOptimalDomain(pluck(params.data, 0), params.width, params.xAxis.algorithm),
			yDomain: getOptimalDomain(pluck(params.data, 1), params.height, params.yAxis.algorithm)
		};

		var d = {
			margin: 20,
			titleHeight: params.title ? 40 : 0,
			yAxisGutter: 50,
			yAxisLabelWidth: params.yAxis.label ? 40 : 0,
			xAxisLabelHeight: params.xAxis.label ? 30 : 0,
			xAxisGutter: 25,
			chartWidth: params.width,
			chartHeight: params.height,
			legendWidth: params.legend ? 150 : 0
		};

		d.chartWidth = context.xDomain.adjustedLength;
		d.chartHeight = context.yDomain.adjustedLength;

		var angledPixelsPerChar = 8;
		if (context.xDomain.maxStepLabelWidth > 12) {
			d.axisLabelAngle = 315;
			var hyp = angledPixelsPerChar * context.xDomain.maxStepLabelWidth,
				base = context.xDomain.step * context.xDomain.pixelsPerUnit;
			//45 degree angle, hypotenuse = textLength, base = context.xDomain.step * context.xDomain.pixelsPerUnit
			d.xAxisGutter = Math.sqrt(hyp * hyp - base * base);
		}

		context.dimensions = d;

		context.dimensions.chartOrigin = {
			x: d.margin + d.yAxisLabelWidth + d.yAxisGutter,
			y: d.margin + d.titleHeight + d.chartHeight
		};

		context.dimensions.totalWidth = d.chartOrigin.x + d.chartWidth + d.legendWidth + d.margin;
		context.dimensions.totalHeight = d.chartOrigin.y + d.xAxisGutter + d.xAxisLabelHeight + d.margin;

		var builder = new XmlBuilder();

		var svg = {};
		Object.defineProperty(svg, 'builder', { value: builder });
		Object.defineProperty(svg, 'root', {
			value: builder.create('svg', {
				version: '1.1',
				baseProfile: 'full',
				width: d.totalWidth,
				height: d.totalHeight,
				xmlns: 'http://www.w3.org/2000/svg'
			})
		});
		Object.defineProperty(context, 'svg', { value: svg });

		var pipeline = [
			drawing.definitions,
			drawing.filters,
			drawing.axes,
			drawing.axisLabels,
			drawing.axisSteps,
			drawing.title,
			drawing.lineData,
			drawing.legend
		];

		pipeline.forEach(function(pipe) {
			pipe(context);
		});

		return context.svg.root.getMarkup({ pretty: true });
	}
};

module.exports = ChartBuilder;
