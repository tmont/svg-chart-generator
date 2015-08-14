var should = require('should'),
	roundProperly = require('../src/round');

describe('Rounding', function() {
	it('should round to nearest tenth', function() {
		roundProperly(0.14, -1, 10).should.equal(0.1);
		roundProperly(0.15, -1, 10).should.equal(0.2);
	});

	it('should round a fraction to nearest hundredth', function() {
		roundProperly(0.143, -2, 10).should.equal(0.14);
		roundProperly(0.145, -2, 10).should.equal(0.15);
	});

	it('should round an integer', function() {
		roundProperly(1, 0, 10).should.equal(1);
		roundProperly(100, 0, 10).should.equal(100);
	});

	it('should round a decimal to nearest integer', function() {
		roundProperly(1.4, 0, 10).should.equal(1);
		roundProperly(1.5, 0, 10).should.equal(2);
		roundProperly(99.9, 0, 10).should.equal(100);
	});
});
