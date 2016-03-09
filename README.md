##Tealium AngularJS Integration
Repository modified to use the Provider pattern.

Contributors

- [Evan Van Dam](https://github.com/evandam/integration-angularjs)
- [Stuart](https://github.com/runfaj/angularJS_TealiumIQ-module)

Providers have the advantage of being available in an application's config block, meaning tealium.js and tealium_data.js do not need to be modified directly. For example:
```javascript
app.config(function(tealiumProvider) {
  tealiumProvider.config({
    account: 'tealiummobile',
    profile: 'demo',
    environment: 'dev',
    ui_selectors: '.trackable, input',
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
Specifying a 'tealium' or 'data-tealium' attribute on an element binds it to Tealium's link function on click.
Additional data can be passed to provide details for the event like normal:
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
- **uiSelectors** - (String) CSS selectors for elements you want to add automatic link tracking to. (example: '.trackable, input')
- **view_id** - (String reference) an object that is a reference or function that returns a unique key for the current view. This key will match the view keys in the 'TealiumUDO' module
- **data_connector** - (Object) an object representing a set of data that you want to pass to the 'TealiumUDO' module to ingest.
- **account** (String) TealiumIQ account
- **profile** (String) TealiumIQ profile
- **environment** (String) TealiumIQ environment ("dev", "qa", "prod")

###TealiumUDO

In **tealium_data.js** the following items need to be edited. In the '**TealiumUDO**' module there is a udo object that are a set of key:value pairs.
- The keys are strings that match the view_id being passed from '**TealiumConfigure**'
- The values are objects with the following format:
  - {'description' : 'description to this view', 'data' : {}}
  - **description** is simply to describe what this object is used for
  - **data** is the data layer that will be placed on the page for this view and passed to TealiumIQ and processed for you 3rd party vendors
