var fs = require('fs'),
	ChartBuilder = require('./src/chart-builder');

function generateRandomData(length) {
	var values = [],
		xValues = {};

	for (var i = 0; i < length; i++) {
		var yCoefficient = Math.random() > 0.5 ? -1 : 1;
		var y = Math.round(Math.random() * 10) / 10 * yCoefficient,
			x;

		do {
			x = Math.round(Math.random() * 1000);
		} while (xValues[x]);

		xValues[x] = 1;


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
		grid: true
	},
	xAxis: {
		color: 'black',
		label: 'Date',
		grid: true
	},
	style: {
		fontFamily: 'Consolas'
	},
	legend: true
};

var svgData = new ChartBuilder().build(options);
fs.writeFileSync('./test.svg', svgData);