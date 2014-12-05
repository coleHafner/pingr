describe('pingr test suite', function() {

	var pingr,
		$httpBackend,
		myEndpoint = '/rest/check-version';

	beforeEach(module('pingr'));

	beforeEach(angular.mock.inject(function(_$httpBackend_, _pingr_) {
		pingr = _pingr_;
		$httpBackend = _$httpBackend_;
	}));

	it('should have these default options', function() {

		pingr.init({endpoint: myEndpoint});

		var defaultOpts = {
			message: 'There are new updates available. Do you want to reload?',
			interval: 60,
			endpoint: myEndpoint,
			retry: 300,
			onChange: null,
			replyKey: null
		};

		expect(pingr.opts).toEqual(defaultOpts);
	});

	it('should throw error if no endpoint', function() {
		expect(function() {pingr.init()}).toThrow(new Error('Endpoint is required.'));
	});

	it('should call onChange on change', function() {

		$httpBackend.whenPOST(myEndpoint).respond({foo: Math.random()});
		pingr.init({endpoint: myEndpoint});
		pingr.ping();
		pingr.ping();
		spyOn(pingr, 'onChange');
		expect(pingr.onChange).toHaveBeenCalled();

	});
});