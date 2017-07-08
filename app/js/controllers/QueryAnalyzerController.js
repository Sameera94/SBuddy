myApp.controller('QueryAnalyzerController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function ($scope, $http, $location, $routeParams, $timeout) {

	$scope.queryData = []

	var getAllExecutedQueryData = function () {
		$http.get('/connection/getQueryData', {
		}).success(function (data) {
			$scope.queryData = data
			console.log(data)
		}).error(function (error) {
			console.log(error);
		});
	}

	var pooling = function() {
		$http.get('/connection/getQueryData', {
		}).success(function (data) {
			$scope.queryData = data
			insertDataToDB(data)
			$timeout(pooling, 10000);
			console.log("New loop started...")
		}).error(function (error) {
			console.log(error);
		});
	};

	pooling();


	var insertDataToDB = function(array) {
		$http.post('/sql/insertNewQueryArray', {
			data: array
		}).success(
			function (data) {
				console.log(data)
			}
		).error(
			function (error) {
				console.log(error);
			}
		);
	}
	
		

}]);