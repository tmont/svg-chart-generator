var fs = require('fs'),
	ChartBuilder = require('./src/chart-builder');

function generateRandomData(length) {
	var values = [],
		xValues = {};

	var testX = [ 1000, 5000, 10000, 25000, 59900, 97363 ];
	length = testX.length;

	for (var i = 0; i < length; i++) {
		var yCoefficient = Math.random() > 0.5 ? -1 : 1;
		var y = Math.round(Math.random() * 10) / 10 * yCoefficient,
			x = testX[i];

		//do {
		//	x = Math.round(Math.random() * 1000);
		//} while (xValues[x]);
		//
		//xValues[x] = 1;
		//
		//
		values.push([ x, y ]);

		//var d = new Date();
		//d.setDate(d.getDate() + i);
		//values.push([ d.getTime(), y ]);
	}

	values.sort(function(a, b) {
		if (a[0] === b[0]) {
			return 0;
		}

		return a[0] < b[0] ? -1 : 1;
	});
	return values;
}

var options = {
	title: 'Line Graph Test',
	type: 'line',
	width: 600,
	height: 350,
	data: [
		{
			color: 'blue',
			label: 'Windows',
			area: true,
			values: generateRandomData(10)
		},
		{
			color: 'magenta',
			label: 'Ubuntu',
			area: true,
			values: generateRandomData(10)
		}
	],
	yAxis: {
		color: 'black',
		label: 'Count',
		algorithm: 'best',
		grid: true
	},
	xAxis: {
		color: 'black',
		label: 'Date',
		algorithm: 'fit-extrema',
		grid: true
	},
	style: {
		fontFamily: 'Consolas'
	},
	legend: true
};

//console.log(require('util').inspect(options.data, false, null, true));

options.data = [{
	color: 'blue',
	label: 'Windows',
	area: true,
	values: [[1000, 0.4],
		[5000, -0],
		[10000, -0.9],
		[25000, 0.4],
		[59900, -0.4],
		[97363, 1]]
},
	{
		color: 'magenta',
		label: 'Ubuntu',
		area: true,
		values: [[1000, -0.3],
			[5000, 0.4],
			[10000, -0.7],
			[25000, -0.2],
			[59900, -0.1],
			[97363, 0.6]]
	}];

var svgData = new ChartBuilder().build(options);
fs.writeFileSync('./test.svg', svgData);