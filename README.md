##angularJS TealiumIQ integration##
----------
This is a sample module to integrate tealiumIQ into your site easily. 
The main libraries for tealium are:

 - tealium.js
 - tealium_data.js

tealium.js - contains the main logic to be called when a route updates or an element who's selector has been added to the config is clicked.

tealium_data.js - contains the data object that references each page that you define.


----------


----------


###Sample usage###
----------
In your app module add the 'TealiumHelper' dependency
example: 

    app = angular.module('app', ['TealiumHelper']);

In your application controller add the following function to its scope
example:

     app.controller('appController', 
		function($scope, tealium) {
	     $scope.tealiumView = tealium.view;
	    }
	 );

Then add the tealiumView() method call to an 