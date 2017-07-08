var myApp = angular.module('myApp', ['ngRoute','angularTreeview']);

myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/newConnection', {
        templateUrl: 'views/newConnection.html',
        controller: 'NewConnectionController'
    }).
    when('/queryAnalyzer', {
        templateUrl: 'views/queryAnalyzer.html',
        controller: 'QueryAnalyzerController'
    }).
    otherwise({
        redirectTo: '/newConnection'
    });
}]);
