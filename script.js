  angular.module('includeExample', ['ngAnimate', 'TealiumHelper'])
   .controller('ExampleController', function($scope, tealium) {
     $scope.templates =
       [ { name: 'template1.html', url: 'template1.html'},
         { name: 'template2.html', url: 'template2.html'} ];
     $scope.template = $scope.templates[0];
     $scope.tealiumView = tealium.view;
   });
   
