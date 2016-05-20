angular.module('App', ['ngAnimate', 'TealiumHelper', 'TealiumHelper.directive'])
  .config(["tealiumProvider", function(tealiumProvider) {
    'use strict';
    tealiumProvider.setConfig({
      account: '',
      profile: 'demo',
      environment: 'dev',
      suppress_first_view: true
    });

    var home = function() {
      var data = {
        "page_type" : "home",
        "date"      : Date(),
        "key"       :"value"
      };
      return data;
    };
    var product = function() {
      var data = {
        "page_type" : "product",
        "key2"  : "value2"
      };
      return data;
    };
    var generic = function() {
      var data = {
        "page_type" : "generic",
        "key"  : "generic value"
      };
      return data;
    };

    tealiumProvider.setViewIdMap({
      '' : home,
      '/template1.html' : home,
      '/template2.html' : product,
      'generic'         : generic
    });
  }])
  .controller('AppController', ["$rootScope", "$scope", "$location", "tealium", function($rootScope, $scope, $location, tealium) {
    $scope.templates =
      [ { name: 'template1.html', url: 'template1.html'},
        { name: 'template2.html', url: 'template2.html'},
        { name: 'template_x.html', url: 'template_x.html'}
      ];

    $scope.updatePath = function(){
      $location.path($scope.template.url);
    };
    $scope.template = $scope.templates[0];
    $scope.updatePath();

/*
*if using include content handling
*/
    $scope.$on("$includeContentLoaded",
      function () {
        tealium.track("view");
      });

/*
*if using view content handling
*/
    $scope.$on("$viewContentLoaded",
      function () {
        //tealium.track("view");
      });

/*
*if using route change handling
*/
    $rootScope.$on('$routeChangeSuccess',
      function(event, toState, toParams, fromState, fromParams){
        //tealium.track("view");
      });

/*
* if using inline for onLoad=
* example: <div  ng-include="template.url" onload="tealiumView()">
*/
    //$scope.tealiumView = tealium.view;

 }]);
