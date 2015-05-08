angular.module('pingr', [])

.service('pingr', [
	'$http',
	'$interval',
	'$window',
	'$timeout',
function(
	$http,
	$interval,
	$window,
	$timeout
) {
	var pingr = {
		cached: null,
		intervalPromise: null,
		opts: {
			message: 'There are new updates available. Do you want to reload?',
			interval: 60,
			endpoint: '',
			retry: 300,
			messageHandler: null, 
			debug: false
		},
		init: function(opts) {

			//override default opts
			for (var key in opts) {
				this.opts[key] = opts[key];
			}

			if (!this.opts.endpoint) {
				throw new Error('Endpoint is required.');
			}

			this.start();
		},
		start: function() {

			var msDelay = this.opts.interval * 1000;

			this.intervalPromise = $interval(function() {
				pingr.ping();
			}, msDelay);
		},
		ping: function() {
			var that = this;
			$http.post(this.opts.endpoint).then(function(r) {

				var current = null;

				for (var k in r.data) {
					if (typeof k !== 'function') {
						current = r.data[k];
						break;
					}
				}

				if (current === null) {
					throw new Error('Pingr could not interpret response from endpoint "' + that.opts.endpoint + '"');
				}

				if (pingr.cached === null) {
					pingr.cached = current;
					return;
				}

				if (pingr.cached === current && that.opts.debug === false) {
					return;
				}

				pingr.reload();

			}, function(r) {
				console.log('Pingr failure reply:', r);
				throw new Error('Pingr could not reach endpoint "' + this.opts.endpoint + '"');
			});
		},
		reload: function() {
			
			if (this.opts.messageHandler !== null) { 
				this.opts.messageHandler(this.opts.message);
				return;
			}
			
			if (!$window.confirm(this.opts.message)) {
				$interval.cancel(this.intervalPromise);

				if (this.opts.retry !== false) {
					var msRetry = this.opts.retry * 1000;
					$timeout(function() {
						pingr.start();
					}, msRetry);
				}
				return;
			}

			$window.location.reload();
		}
	};

	return pingr;
}]);
