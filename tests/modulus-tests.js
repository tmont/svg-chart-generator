var should = require('should'),
	oneTrueMod = require('../src/modulus');

describe('Modulus', function() {
	it('should calculate modulus of two positive integers', function() {
		oneTrueMod(3, 5).should.equal(3);
		oneTrueMod(8, 5).should.equal(3);
		oneTrueMod(5, 5).should.equal(0);
		oneTrueMod(0, 5).should.equal(0);
	});

	it('should calculate modulus of two positive fractions', function() {
		oneTrueMod(0.1, 1).should.be.approximately(0.1, 0.000001);
		oneTrueMod(1.1, 1).should.be.approximately(0.1, 0.000001);
	});

	it('should calculate modulus of positive fraction and an integer', function() {
		oneTrueMod(0.1, 1).should.be.approximately(0.1, 0.000001);
		oneTrueMod(1.1, 1).should.be.approximately(0.1, 0.000001);
	});

	it('should calculate modulus of two positive fractions', function() {
		oneTrueMod(0.1, 0.7).should.equal(0.1);
		oneTrueMod(1.1, 0.7).should.equal(0.4);
		oneTrueMod(0, 0.7).should.be.equal(0);
		oneTrueMod(0.7, 0.7).should.be.equal(0);
	});

	it('should calculate modulus of negative integers', function() {
		oneTrueMod(-4, 7).should.equal(3);
		oneTrueMod(-11, 7).should.equal(3);
	});

    it('should calculate modulus of negative fraction and an integer', function() {
        oneTrueMod(-0.1, 1).should.equal(0.9);
        oneTrueMod(-1.1, 1).should.equal(0.9);
    });

    it('should calculate modulus of a negative fraction and a fraction', function() {
        oneTrueMod(-0.1, 0.7).should.equal(0.6);
        oneTrueMod(-0.8, 0.7).should.equal(0.6);
    });
});