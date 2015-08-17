var oneTrueMod = require('./modulus'),
	roundProperly = require('./round');

function getOptimalDomain(values, length, algorithm) {
	algorithm = algorithm || 'best';
	var oneSecond = 1000,
		oneMinute = oneSecond * 60,
		oneHour = oneMinute * 60,
		oneDay = oneHour * 24;
    var i;
    var max = -Infinity, min = Infinity;
    for (i = 0; i < values.length; i++) {
        max = Math.max(values[i], max);
        min = Math.min(values[i], min);
    }

	var base = 10;
	var diff = max - min;
    //TODO this 2.5 should be some function of the length
    //i.e. the amount of space allotted for the step text
	var optimalNumSteps = Math.ceil(Math.sqrt(length) / 2.5);
	var exactStep = diff / optimalNumSteps;

	function calculate(base, useMod) {
		var exponent = Math.round(Math.log(exactStep) / Math.log(base));
		var step = Math.pow(base, exponent);
		var defaultNumSteps = diff / step;
		var diffFromOptimal = Math.round(defaultNumSteps / optimalNumSteps);
		if (!diffFromOptimal) {
			return false;
		}
		//if ((diffFromOptimal - optimalNumSteps) > Math.sqrt(optimalNumSteps)) {
			step *= diffFromOptimal;
		//} else {
		//	step *= optimalNumSteps;
		//}

		//only adjust number of steps if it's more than the square root away
		//the idea is that we don't want to adjust the number of steps away from
		//the default unless it makes a big difference (e.g. having 10 steps instead of 100)

		//console.log(step, defaultNumSteps, optimalNumSteps, diffFromOptimal);
		if (!step) {
			//TODO this is almost certainly a bad idea...
			return false;
		}

		var realMax = max;
		var realMin = min;

		var modMax = oneTrueMod(max, step);
		var modMin = oneTrueMod(min, step);

		var absoluteMax = max;
		var absoluteMin = min;
		if (useMod) {
			absoluteMax = max + (modMax ? (step - modMax) : 0);
			absoluteMin = min - modMin;
		}
		return {
			exponent: exponent,
			absoluteMax: absoluteMax,
			absoluteMin: absoluteMin,
			realMax: realMax,
			realMin: realMin,
			modMox: modMax,
			modMin: modMin,
			step: step,
			numSteps: defaultNumSteps
		};
	}

	function dateStuff() {

		var bases = [
			oneDay,
			oneHour,
			oneMinute,
			oneSecond
		];

		do {
			var result = calculate(bases.shift());
			if (result && bases.length && bases[0] > result.step) {
				result = false;
			}
		} while (!result && bases.length);
		return result;
	}

	var result,
		stepValues = [];
	if (algorithm === 'date') {
		result = dateStuff();
	} else {
		result = calculate(10, true);
		if (algorithm === 'best') {
			result.realMin = result.absoluteMin;
			result.realMax = roundProperly(result.absoluteMax, base);
		}
	}

	var realNumSteps = Math.ceil((result.realMax - result.realMin) / result.step);

	stepValues.push(result.realMin);
	for (i = 1; i < realNumSteps; i++) {
		stepValues.push(roundProperly(result.absoluteMin + (result.step * i), base));
	}
	stepValues.push(result.realMax);

	var pixelsPerUnit = length / realNumSteps / result.step;

	var labels = stepValues.map(function(value) {
		function format(timestamp) {
			var date = new Date(timestamp);

			function pad(value) {
				return value < 10 ? '0' + value : value;
			}

			var dateStr = [
				date.getFullYear(),
				pad(date.getMonth() + 1),
				pad(date.getDate())
			].join('-');

			var time = [
				pad(date.getHours()),
				pad(date.getMinutes()),
				pad(date.getSeconds())
			].join(':');

			if (diff < oneDay) {
				return time;
			}
			if (result.step >= oneDay) {
				return dateStr;
			}

			return dateStr + ' ' + time;
		}

		return algorithm === 'date' ? format(value) : value.toString();
	});

	var maxLabelWidth = labels.reduce(function(max, next) {
		return Math.max(max, next.length);
	}, 0);

	return {
		algorithm: algorithm,
		diff: diff,
		min: result.realMin,
		max: result.realMax,
		step: result.step,
		numSteps: realNumSteps,
		pixelsPerUnit: pixelsPerUnit,
		exp: result.exponent,
		stepValues: stepValues,
		originalLength: length,
		adjustedLength: (result.realMax - result.realMin) * pixelsPerUnit,
		maxStepLabelWidth: maxLabelWidth,
		labels: labels
	};
}

module.exports = getOptimalDomain;
