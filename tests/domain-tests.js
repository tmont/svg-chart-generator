var should = require('should'),
	getDomain = require('../src/domain');

describe('Domain', function() {
	var length = 600;
	it('should handle positive numbers between 1 and 10', function() {
		var values = [ 1.1, 2.1, 3.7, 8.9, 6.5 ];
		var domain = getDomain(values, length, 'best');
		domain.should.have.property('stepValues', [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]);
	});

	it('should handle negative numbers between -10 and 10', function() {
		var values = [ 1.1, 2.1, 3.7, 8.9, 6.5, -8, -3.6, -1, 0 ];
		var domain = getDomain(values, length, 'best');
		domain.should.have.property('stepValues', [ -8, -6, -4, -2, 0, 2, 4, 6, 8, 10 ]);
	});

	it('should handle numbers between 1 and 100000', function() {
		var values = [ 1, 3, 60, 180, 770, 9000, 18000, 0, 560, 150, 59900, 80000 ];
		var domain = getDomain(values, length, 'best');
		domain.should.have.property('stepValues', [ 0, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000 ]);
	});

	it('should handle numbers between 0 and 1', function() {
		var values = [ 0.1, 0.3, 0.7, 0.45, 0.333, 0.17 ];
		var domain = getDomain(values, length);
		domain.should.have.property('stepValues', [ .1, .2, .3, .4, .5, .6, .7 ]);
	});

	it('should get exact fit', function() {
		var values = [ 1000, 5000, 10000, 25000, 59900, 97363 ];
		var domain = getDomain(values, length, 'exact');
		domain.should.have.property(
			'stepValues',
			[ 1000, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 97363 ]
		);
	});
});