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

	var modMax = oneTrueMod(max, step);
	var modMin = oneTrueMod(min, step);

	var absoluteMax = max + (modMax ? (step - modMax) : 0);
	var absoluteMin = min - modMin;

	var stepValues = [ ];
	if (fit === 'best') {
		realMin = absoluteMin;
		realMax = roundProperly(absoluteMax, base);
	}
	var realNumSteps = Math.ceil((realMax - realMin) / step);

	stepValues.push(realMin);
	for (var i = 1; i < realNumSteps; i++) {
		stepValues.push(roundProperly(absoluteMin + (step * i), base));
	}
	stepValues.push(realMax);

	var pixelsPerUnit = length / realNumSteps / step;

	return {
		fit: fit,
		moddedMin: absoluteMin,
		moddedMax: absoluteMax,
		mins: {
			min: min,
			mod: modMin,
			realMin: realMin,
			moddedMin: absoluteMin,
			roundedModMin: roundProperly(modMin, base)
		},
		maxes: {
			max: max,
			realMax: realMax,
			absoluteMax: absoluteMax,
			modOfMax: roundProperly(modMax, base)
		},
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