pingr
=====
Pingr is a simple utility to ping an endpoint on an interval. It's useful for things like version checking.

#### Installation
* bower install pingr
* git clone git@github.com:coleHafner/pingr.git

#### Options
```javascript
{
  //String - the endpoint to ping. This is not manipulated by pingr in any way. Defaults to ''.
  //the directive will throw an error if the endpoint is not provided or not reachable.
  endpoint: '',
  
  //String - The message displayed to the user in a basic javascript confirm.
  message: 'There are new updates available. Would you like to reload?',
  
  //Int - The number of seconds to wait before pinging the endpoint.
  interval: 60,
  
  //Mixed - The number of seconds to wait before re-starting the interval. This is triggered when
  //the user cancels the confirm message. If a retry is not desired, set this value to false.
  retry: 500
}
```

#### Usage
```javascript
angular.module('myApp', ['pingr'])

  .run(['pingr'], function(pingr) {
  
    /*
    This initializes an interval that pings <endpoint> every <interval> seconds. If the value 
    returned by the endpoint changes, a confirm with <message> is displayed to the user. If the
    user clicks 'okay'. The page reloads and the interval restarts. If 'Cancel' is chosen, the 
    interval will restart again in (<retry> + <interval>) seconds. 
    */
    pingr.init({
      endpoint: '',
      message: 'There are new updates available. Would you like to reload?',
      retry: 300,
      interval: 60
    });
  }
```

#### Tips
Pingr only accepts one value from the server. There is no special key to use, the first element in the response is auto-selected. 
For example, if the response is ``{foo: 'val1', bar: 'val2', baz: 'val3'}`` the ``foo`` key will be chosen. 

A common use for Pingr may be to check for updates to the repository. To get the most recent 
git hash run ``git rev-parse HEAD``. 
