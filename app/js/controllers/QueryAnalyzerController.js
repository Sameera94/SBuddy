myApp.controller('QueryAnalyzerController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function ($scope, $http, $location, $routeParams, $timeout) {

	$scope.queryData = []
	var isListening = false;
	$scope.logsArray = []

	// var getAllExecutedQueryData = function () {
	// 	$http.get('/connection/getQueryData', {
	// 	}).success(function (data) {
	// 		$scope.queryData = data
	// 		console.log(data)
	// 	}).error(function (error) {
	// 		console.log(error);
	// 	});
	// }

	var addLogItem = function(data,status){
		var time = new Date();

		$scope.logsArray.push({
			"time": time,
			"data": data,
			"color": status
		})
	}

	var pooling = function() {
		if(isListening){
			$http.get('/connection/getQueryData', {
			}).success(function (data) {
				$scope.queryData = data
			}).error(function (error) {
				console.log(error);
			});
		}
		$timeout(pooling, 5000);
	};

	pooling();

	$scope.startListener = function() {
		addLogItem("Start listener",2);
		isListening = true;
	}

	$scope.stopListener = function() {
		isListening = false;
	}

	$scope.startAnalyzer = function() {
		addLogItem("Start Analyzer",2);
	}

	$scope.stopAnalyzer = function() {
		addLogItem("Stop Analyzer",2);
	}

	$scope.viewAnalyzerResults = function() {
		addLogItem("View Analyzer Results",2);
	}

}]);