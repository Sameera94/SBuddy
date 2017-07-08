myApp.controller('QueryAnalyzerController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function ($scope, $http, $location, $routeParams, $timeout) {

	var getAllExecutedQueryData = function () {
		$http.get('/connection/getQueryData', {
		}).success(function (data) {
			$scope.queryData = data
			console.log(data)
		}).error(function (error) {
			console.log(error);
		});
	}

getAllExecutedQueryData()


}]);