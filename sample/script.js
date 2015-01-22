  angular.module('App', ['ngAnimate', 'TealiumHelper'])
   .controller('AppController', function($rootScope, $scope, $location, tealium) {
      $scope.templates =
        [ { name: 'template1.html', url: 'template1.html'},
          { name: 'template2.html', url: 'template2.html'},
          { name: 'template_x.html', url: 'template_x.html'} 
        ];
      
      $scope.updatePath = function(){
        $location.path($scope.template.url);
      };
      $scope.template = $scope.templates[0];

/*
*if using include content handling
*/
      $scope.$on("$includeContentLoaded", 
        function () {
          tealium.view();
        });
        
/*
*if using view content handling
*/
      $scope.$on("$viewContentLoaded", 
        function () {
          //tealium.view(); 
        });
        
/*
*if using route change handling
*/
      $rootScope.$on('$routeChangeSuccess',
        function(event, toState, toParams, fromState, fromParams){ 
          //tealium.view();
        });
        
/* 
* if using inline for onLoad=
* example: <div  ng-include="template.url" onload="tealiumView()">
*/
      //$scope.tealiumView = tealium.view;

   });
   
