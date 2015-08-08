var oneTrueMod = require('./modulus');

function getOptimalDomain(values, length, type) {
	var max = values.reduce(function(max, next) {
		return Math.max(max, next);
	}, -Infinity);
	var min = values.reduce(function(min, next) {
		return Math.min(min, next);
	}, Infinity);

	var diff = max - min;
	var optimalNumSteps = Math.ceil(Math.sqrt(length) / 2.5);
	var exactStep = diff / optimalNumSteps;
	var exponent = Math.round(Math.log(exactStep) / Math.log(10));
	var step = Math.pow(10, exponent);
	var numSteps = diff / step;
	step = step * Math.round(numSteps / optimalNumSteps);
	var realMax = max + (step - oneTrueMod(max, step));
	var realMin = min - oneTrueMod(min, step);
	var realNumSteps = Math.ceil((realMax - realMin) / step);

	return {
		min: realMin,
		max: realMax,
		step: step,
		diff: diff,
		numSteps: realNumSteps,
		stepLength: length / realNumSteps / step,
		optimalSteps: optimalNumSteps,
		exp: exponent,
		exactStep: exactStep
	};
}

module.exports = getOptimalDomain;