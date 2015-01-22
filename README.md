##**angularJS TealiumIQ integration**##
----------
This is a sample module to integrate tealiumIQ into your site easily. 
The main libraries for tealium are:

 - **tealium.js**
 - **tealium_data.js**

tealium.js - contains the main logic to be called when a route updates or an element who's selector has been added to the config is clicked.

tealium_data.js - contains the data object that references each page that you define.


----------


----------


###**Sample usage**###
----------
In your app module add the 'TealiumHelper' dependency
example: 

    app = angular.module('app', ['TealiumHelper']);

In your application controller, call tealium.view() in a listener for any given event:

     app.controller('appController', 
		function($scope, tealium) {
		...
	     $scope.$on("$includeContentLoaded", // any broadcast event to listen for
        	function () {
          		tealium.view();
        	});
        ...
	    }
	 );

** Another alternative is to declare a function in the current scope and call it inline when an element loads

     app.controller('appController', 
		function($scope, tealium) {
		...
	     $scope.tealiumView = tealium.view;
        ...
	    }
	 );
You can then use tealiumView() anywhere thats within scope of your app controller to fire a tealium view, effectively simulating a page view event.
example:

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

** These are only sample methods to implement, choose whichever meets your apps needs the best.

####**Configuring the Tealium Module**####
#####**TealiumConfigure**#####
In **tealium.js** the following items need to be edited. In the '**TealiumConfigure**' module there are the following items

 - **this.uiSelectors** - (String) CSS selectors for elements you want to add automatic link tracking to. (example:  '.trackable, input')
 - **this.view_id** - (String reference) an object that is a reference or function that returns a unique key for the current view. This key will match the view keys in the 'TealiumUDO' module 
 - **this.data_connector** - (Object) an object representing a set of data that you want to pass to the 'TealiumUDO' module to ingest.
 - **this.account** (String) tealiumIQ account
 - **this.profile** (String) tealiumIQ profile
 - **this.environment** (String) tealiumIQ environment ("dev", "qa", "prod")
 - **this.suppress_first_view** (bool) true disables the default utag.view() track call by default when the library loads
#####**TealiumUDO**#####
In **tealium_data.js** the following items need to be edited. In the '**TealiumUDO**' module there is a view_id_map object that are a set of key:value pairs. 
 
 - The keys are strings that match the view_id being passed from '**TealiumConfigure**'
 - The values are references to closures which return an object literal that matches the page type of the view_id
For every key in view_id_map the closure references need to exist such that they are:
 - An anonymous function
 - return an object literal with all data that needs to be exposed for the page type associated with the view_id

<br><br><br>
**In this repo is a set of very simple files to test the plugin**

**http://plnkr.co/edit/3qQNwf1eOi4SfnDT3IPg a plunker to test the files
