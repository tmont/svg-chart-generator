var oneTrueMod = require('./modulus'),
	roundProperly = require('./round');

function getOptimalDomain(values, length, fit) {
	var max = values.reduce(function(max, next) {
		return Math.max(max, next);
	}, -Infinity);
	var min = values.reduce(function(min, next) {
		return Math.min(min, next);
	}, Infinity);

	var base = 10;
	var diff = max - min;
	var optimalNumSteps = Math.ceil(Math.sqrt(length) / 2.5);
	var exactStep = diff / optimalNumSteps;
	var exponent = Math.round(Math.log(exactStep) / Math.log(base));
	var step = Math.pow(base, exponent);
	var numSteps = diff / step;
	step = step * Math.round(numSteps / optimalNumSteps);

	var realMax = max;
	var realMin = min;
	var moddedMax = max + (step - oneTrueMod(max, step));
	var stepValues = [ ];
	var moddedMin = min - oneTrueMod(min, step);
	if (fit === 'best') {
		realMin = moddedMin;
		realMax = roundProperly(moddedMax, base);
	}
	var realNumSteps = Math.ceil((realMax - realMin) / step);

	stepValues.push(realMin);
	for (var i = 1; i < realNumSteps; i++) {
		stepValues.push(roundProperly(moddedMin + (step * i), base));
	}
	stepValues.push(realMax);

	var pixelsPerUnit = length / realNumSteps / step;

	return {
		fit: fit,
		moddedMin: moddedMin,
		moddedMax: moddedMax,
		min: realMin,
		max: realMax,
		step: step,
		numSteps: realNumSteps,
		pixelsPerUnit: pixelsPerUnit,
		exp: exponent,
		stepValues: stepValues,
		originalLength: length,
		adjustedLength: (realMax - realMin) * pixelsPerUnit
	};
}

module.exports = getOptimalDomain;