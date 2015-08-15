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
		domain.should.have.property('stepValues', [ 0, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000 ]);
	});

	it('should handle numbers between 0 and 1', function() {
		var values = [ 0.1, 0.3, 0.7, 0.45, 0.333, 0.17 ];
		var domain = getDomain(values, length, 'best');
		domain.should.have.property('stepValues', [ .1, .2, .3, .4, .5, .6, .7 ]);
	});

	it('should handle simple integral domain', function() {
		var values = [ 1, 2, 3, 4, 5, 6, 7, 8 ];
		var domain = getDomain(values, length, 'best');
		domain.should.have.property('stepValues', [ 1, 2, 3, 4, 5, 6, 7, 8 ]);
	});

	it('should handle simple integral domain with few values', function() {
		var values = [ 1, 2 ];
		var domain = getDomain(values, length, 'best');
		domain.should.have.property('stepValues', [ 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2 ]);
	});

	it('should get extrema fit', function() {
		var values = [ 1000, 5000, 10000, 25000, 59900, 97363 ];
		var domain = getDomain(values, length, 'fit-extrema');
		domain.should.have.property(
			'stepValues',
			[ 1000, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 97363 ]
		);
	});

	it('should fit values between -1 and 1 by .2', function() {
		var values = [ 0.4, -0, -0.9, 0.4, -0.4, 1, -0.3, 0.4, -0.7, -0.2, -0.1, 0.6 ];
		var domain = getDomain(values, 350, 'best');
		domain.should.have.property(
			'stepValues',
			[ -1, -0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1 ]
		);
	});

	describe('date', function() {
		it('should use one hour as domain', function() {
			var date = new Date(2015, 6, 5, 12, 0, 0);
			var values = [];
			for (var i = 0; i < 10; i++) {
				values.push(date.getTime());
				date.setHours(date.getHours() + 1);
			}

			var domain = getDomain(values, 600, 'date');
			domain.should.have.property('step', 3600000);
			domain.stepValues.should.eql([
				1436122800000,
				1436126400000,
				1436130000000,
				1436133600000,
				1436137200000,
				1436140800000,
				1436144400000,
				1436148000000,
				1436151600000,
				1436155200000]);

			//var stepValues = domain.stepValues.map(function(value) {
			//	return new Date(value);
			//});
			//console.log(require('util').inspect(domain, false, null, true));
			//console.log(require('util').inspect(stepValues, false, null, true));
		});

		it('should use one second as domain', function() {
			var date = new Date(2015, 6, 5, 12, 0, 0, 0);
			var values = [];
			for (var i = 0; i < 10; i++) {
				values.push(date.getTime());
				date.setSeconds(date.getSeconds() + 1);
			}

			var domain = getDomain(values, 600, 'date');
			domain.should.have.property('step', 1000);
			domain.stepValues.should.eql([
				1436122800000,
				1436122801000,
				1436122802000,
				1436122803000,
				1436122804000,
				1436122805000,
				1436122806000,
				1436122807000,
				1436122808000,
				1436122809000]);

			//var stepValues = domain.stepValues.map(function(value) {
			//	return new Date(value);
			//});
			//console.log(require('util').inspect(domain, false, null, true));
			//console.log(require('util').inspect(stepValues, false, null, true));
		});

		it('should use five seconds as domain', function() {
			var date = new Date(2015, 6, 5, 12, 0, 0, 0);
			var values = [];
			for (var i = 0; i < 10; i++) {
				values.push(date.getTime());
				date.setSeconds(date.getSeconds() + 5);
			}

			var domain = getDomain(values, 600, 'date');
			domain.should.have.property('step', 5000);
			domain.stepValues.should.eql([
				1436122800000,
				1436122805000,
				1436122810000,
				1436122815000,
				1436122820000,
				1436122825000,
				1436122830000,
				1436122835000,
				1436122840000,
				1436122845000]);

			//var stepValues = domain.stepValues.map(function(value) {
			//	return new Date(value);
			//});
			//console.log(require('util').inspect(domain, false, null, true));
			//console.log(require('util').inspect(stepValues, false, null, true));
		});

		it('should use one minute as domain', function() {
			var date = new Date(2015, 6, 5, 12, 0, 0);
			var values = [];
			for (var i = 0; i < 10; i++) {
				values.push(date.getTime());
				date.setMinutes(date.getMinutes() + 1);
			}

			var domain = getDomain(values, 600, 'date');
			domain.should.have.property('step', 60000);
			domain.stepValues.should.eql([
				1436122800000,
				1436122860000,
				1436122920000,
				1436122980000,
				1436123040000,
				1436123100000,
				1436123160000,
				1436123220000,
				1436123280000,
				1436123340000]);
		});

		it('should use 1 day as domain step', function() {
			var date = new Date(2015, 6, 5, 12, 0, 0);
			var values = [ ];
			for (var i = 0; i < 10; i++) {
				values.push(date.getTime());
				date.setDate(date.getDate() + 1);
			}

			var domain = getDomain(values, 600, 'date');
			domain.should.have.property('step', 86400000);
			domain.stepValues.should.eql([
				1436122800000,
				1436209200000,
				1436295600000,
				1436382000000,
				1436468400000,
				1436554800000,
				1436641200000,
				1436727600000,
				1436814000000,
				1436900400000]);
		});

		it('should use 2 days as domain step', function() {
			var date = new Date(2015, 6, 5, 12, 0, 0);
			var values = [];
			for (var i = 0; i < 10; i++) {
				values.push(date.getTime());
				date.setDate(date.getDate() + 2);
			}

			var domain = getDomain(values, 600, 'date');
			domain.should.have.property('step', 172800000);
			domain.stepValues.should.eql([
				1436122800000,
				1436295600000,
				1436468400000,
				1436641200000,
				1436814000000,
				1436986800000,
				1437159600000,
				1437332400000,
				1437505200000,
				1437678000000]);
		});

		it('should use 180 days as domain step', function() {
			var date = new Date(2015, 6, 5, 12, 0, 0);
			var values = [];
			for (var i = 0; i < 10; i++) {
				values.push(date.getTime());
				date.setDate(date.getDate() + 200);
			}

			var domain = getDomain(values, 600, 'date');
			domain.should.have.property('step', 15552000000);
			domain.stepValues.should.eql([
				1436122800000,
				1451674800000,
				1467226800000,
				1482778800000,
				1498330800000,
				1513882800000,
				1529434800000,
				1544986800000,
				1560538800000,
				1576090800000,
				1591642800000]);
		});
	});
});