var myApp = angular.module('myApp', ['ngRoute','angularTreeview']);

myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/newConnection', {
        templateUrl: 'views/newConnection.html',
        controller: 'NewConnectionController'
    }).
    otherwise({
        redirectTo: '/newConnection'
    });
}]);
