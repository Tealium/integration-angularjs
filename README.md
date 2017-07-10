## Tealium AngularJS Integration

## Installation

Using Bower

```
bower install angular-tealium
```

Using NPM

```
npm install https://github.com/Tealium/integration-angularjs
```

## Using the /sample app

(1) After installation, navigate to your directory where the sample folder is located

```
cd ./myapp/node_modules/angular-tealium/sample
```

(2) Update the tealiumProvider.setConfig params for 'account' and 'profile' to your own Tealium account/profile combination
```
vi script.js
```
```
account: 'UPDATE_TO_YOUR_ACCOUNT',
profile: 'UPDATE_TO_YOUR_PROFILE',

```

(3) Start up a web server in this directory
```
python -m SimpleHTTPServer 8000
```

(4) Load up http://localhost:8000/ in your web browser

(5) NOTE: Configure tags in Tealium iQ and publish to 'dev' environment if you haven't already

(6) Use proxy tool or Network tab in your browser Console to see your tags fire


## Updated to use the Provider pattern

This repository was last modified to use the Provider pattern.

Contributors

- https://github.com/Tealium/integration-angularjs/graphs/contributors

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

# Modules
This is a sample module to integrate Tealium iQ into your site easily. The main library for Tealium is **tealium_angular.js** which has the following parts

* TealiumHelper - Loads the Tealium JavaScript (utag.js) file and sets up tracking function (tealium.track)

* TealiumHelper.data - Returns the custom data layer for the specific view

* TealiumHelper.directive - Add element-specific data to data layer from "data-tealium" element data attribute 

## Sample usage
In your app module add the 'TealiumHelper' dependency example:
```javascript
var app = angular.module('app', ['TealiumHelper']);
```
### Option 1
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
### Option 2
Alternatively you can include the TealiumHelper module in your route logic and call tealium.view() in your $includeContentLoaded callback example:
```javascript
$scope.$on("$includeContentLoaded",
    function () {
      tealium.view();
    });
```

## Configuring the Tealium Module

The follow configuration settings are required

- **account** (String) Tealium iQ account
- **profile** (String) Tealium iQ profile
- **environment** (String) Tealium iQ environment ("dev", "qa", "prod")

The example in script.js shows how to configure

```javascript
  tealiumProvider.setConfig({
      account: 'myaccount',
      profile: 'myprofile',
      environment: 'prod',
      suppress_first_view: true
  });
```

## Example

- For an example, see files in /sample folder.  This sample app uses the *Option 2* method described above.

- Any element marked with "data-tealium" will be tracked as a link click event (using utag.link)

- In the /sample/template1.html you can see how utag.link calls fire based on button clicks.  To see the data layer with each call to utag.link, set debug cookie in console: document.cookie="utagdb=true"

- Only a specific set of tags in Tealium's Tag Marketplace support the utag.link event tracking and some (i.e. Google Analytics) will require mapping

- This module defines tealium.track which is a wrapper to utag.track.

```javascript
    tealium.track( "view", {
      page_name : "my page",
      event_name : "my event",
      more_data : "any data"
    });
```

