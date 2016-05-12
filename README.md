##Tealium AngularJS Integration
Repository modified to use the Provider pattern.

Contributors

- [Evan Van Dam](https://github.com/evandam/integration-angularjs)
- [Stuart](https://github.com/runfaj/angularJS_TealiumIQ-module)

Providers have the advantage of being available in an application's config block, meaning tealium.js and tealium\_data.js do not need to be modified directly. For example:
```javascript
app.config(function(tealiumProvider) {
  tealiumProvider.setConfig({
    account: 'tealiummobile',
    profile: 'demo',
    environment: 'dev',
    suppress_first_view: true
  });
  tealiumProvider.setViewIdMap({
    '/index': function () {
      return {
        data1: 1,
        data2: 2
      };
    }
  });
});
```

A directive has also been created.
Specifying 'data-tealium' attribute on an element binds this data to Tealium's link function on click.
Additional data can be passed to provide details for the specific event:
```html
<button data-tealium='{"event":"button pressed", "button_name":"button2"}'>
  Button
</button>
```
#Libraries
This is a sample module to integrate TealiumIQ into your site easily. The main libraries for Tealium are:

- **tealium.js**
- **tealium_data.js**

**tealium.js** - contains the main logic to be called when a route updates or an element who's selector has been added to the config is clicked.

**tealium_data.js** - contains the data object that references each page that you define.
##Sample usage
In your app module add the 'TealiumHelper' dependency example:
```javascript
app = angular.module('app', ['TealiumHelper']);
```
###Option 1
In your application controller add the following function to its scope example:
```javascript
app.controller('appController',
    function($scope, tealium) {
     $scope.tealiumView = tealium.view;
    }
 );
```
You can then use tealiumView() anywhere thats within scope of your app controller to fire a tealium view, effectively simulating a page view event. example:
```html
< body ng-app="App" >
...
   < div class="slide-animate-container" >
     < div ng-view class="slide-animate" >
     ...
       < div ng-include="template.url" onload= "tealiumView()" >< /div >
     < /div >
   < /div >
 < /div >
< /body >
```
###Option 2
Alternatively you can include the TealiumHelper module in your route logic and call tealium.view() in your $includeContentLoaded callback example:
```javascript
$scope.$on("$includeContentLoaded",
    function () {
      tealium.view();
    });
```

##Configuring the Tealium Module
###TealiumConfigure

In **tealium.js** the following items need to be edited. In the '**TealiumConfigure**' module there are the following items
- **account** (String) TealiumIQ account
- **profile** (String) TealiumIQ profile
- **environment** (String) TealiumIQ environment ("dev", "qa", "prod")


## Example

- For an example, see files in /sample folder.  This sample app uses the *Option 2* method described above.

- Any element marked with "data-tealium" will be tracked as a link click event (using utag.link)

- In the /sample/template1.html you can see how utag.link calls fire based on button clicks.  To see the data layer with each call to utag.link, set debug cookie in console: document.cookie="utagdb=true"

- Only a specific set of tags in Tealium's Tag Marketplace support the utag.link event tracking and some (i.e. Google Analytics) will require mapping

- This module defines tealium.track which is a wrapper to utag.track.  You can invoke directly at any point in the application
``` tealium.track( "view", {
      page_name : "my page",
      event_name : "my event",
      more_data : "any data"
    }
```

