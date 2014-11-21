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
			onChange: null,
			replyKey: null
		},
		init: function(opts) {

			//override default opts
			angular.extend(this.opts, opts);
			console.log('opts', this.opts);

			if (!this.opts.endpoint) {
				throw new Error('Endpoint is required.');
			}

			this.start();
		},
		start: function() {

			var msDelay = this.opts.interval * 1000;

			//do intial ping
			this.ping();

			this.intervalPromise = $interval(function() {
				pingr.ping();
			}, msDelay);
		},
		ping: function() {

			$http.get(this.opts.endpoint).then(function(r) {

				var current = null;

				if (typeof r.data === 'string') {
					current = r.data;

				}else if(pingr.opts.replyKey !== null) {
					current = r.data[pingr.opts.replyKey];
					console.log('customKey');
				}else {
					for (var k in r.data) {
						if (typeof k !== 'function') {
							current = r.data[k];
							break;
						}
					}
				}

				console.log('picked val:', current);

				if (current === null) {
					throw new Error('Pingr could not interpret response from endpoint "' + this.opts.endpoint + '"');
				}

				if (pingr.cached === null) {
					pingr.cached = current;
					return;
				}

				if (pingr.cached === current) {
					return;
				}

				pingr.onChange(r);

			}, function(r) {
				console.log('Pingr failure reply:', r);
				throw new Error('Pingr could not reach endpoint "' + this.opts.endpoint + '"');
			});
		},
		onChange: function(reply) {
			if (typeof this.opts.onChange === 'function') {
				this.opts.onChange(reply, this);
				return;
			}

			this.reload();
		},
		reload: function() {
			if (!$window.confirm(this.opts.message)) {
				this.cancel();

				if (this.opts.retry !== false) {
					var msRetry = this.opts.retry * 1000;
					$timeout(function() {
						pingr.start();
					}, msRetry);
				}
				return;
			}

			$window.location.reload();
		},
		cancel: function() {
			$interval.cancel(this.intervalPromise);
		}
	};

	return pingr;
}]);
