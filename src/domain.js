var oneTrueMod = require('./modulus'),
	roundProperly = require('./round');

function getOptimalDomain(values, length, fit) {
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
	var exponent = Math.round(Math.log(exactStep) / Math.log(base));
	var step = Math.pow(base, exponent);
	var numSteps = diff / step;
	var originalStep = step;
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
	for (i = 1; i < realNumSteps; i++) {
		stepValues.push(roundProperly(absoluteMin + (step * i), base));
	}
	stepValues.push(realMax);

	var pixelsPerUnit = length / realNumSteps / step;

	return {
		fit: fit,
        diff: diff,
        _: {
            max: max,
            min: min,
            realMax: realMax,
            realMin: realMin,
            absoluteMin: absoluteMin,
            modMin: modMin,
            modMax: modMax,
            exactStep: exactStep,
            optimalNumSteps: optimalNumSteps,
	        numSteps: numSteps,
	        originalStep: originalStep
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
