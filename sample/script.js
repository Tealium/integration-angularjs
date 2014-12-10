  angular.module('App', ['ngAnimate', 'TealiumHelper'])
   .controller('AppController', function($rootScope, $scope, $location, tealium) {
     $scope.templates =
       [ { name: 'template1.html', url: 'template1.html'},
         { name: 'template2.html', url: 'template2.html'} ];
    $rootScope.$on("$routeChangeSuccess", 
      function (event, current, previous, rejection) {
        console.log($scope, $rootScope, $route, $location);
      });
     $scope.updatePath = function(){
       $location.path($scope.template.url);
     };
     $scope.template = $scope.templates[0];
     $scope.tealiumView = tealium.view;
   });
   
