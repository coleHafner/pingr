describe('pingr test suite', function() {

	var pingr, $httpBackend;

	beforeEach(module('pingr'));

	beforeEach(angular.mock.inject(function(_$httpBackend_) {
		$httpBackend = _$httpBackend_;
	}));

	it('should have these default options', function() {
		var defaultOpts = {
			message: 'There are new updates available. Do you want to reload?',
			interval: 60,
			retry: 300,
			endpoint: null,
			replyKey: null,
			onChange: null
		};

		expect(pingr.opts).toBe(defaultOpts);
	});
});