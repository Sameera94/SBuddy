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

	var addLogItemWithTimeout = function(data,status,time) {
		$timeout(function() {
            addLogItem(data,status);
        }, time);
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
		addLogItem("Start listening...",2);
		isListening = true;
	}

	$scope.stopListener = function() {
		addLogItem("Stop listener...",2);
		isListening = false;
	}

	$scope.startAnalyzer = function() {
		addLogItem("Start Analyzing...",2);
		$http.get('/sql/startAnalyzer', {
		}).success(function (data) {
			addLogItemWithTimeout("Processing queries...",1,2000);
			addLogItemWithTimeout("Remove duplicate records...",1,4000);
			addLogItemWithTimeout("Sumarizing final records...",1,6000);
			addLogItemWithTimeout("Executing queries & save results...",1,9000);
			addLogItemWithTimeout("Processing final records...",1, 11000)
			addLogItemWithTimeout("Query Analyzing completed...",1,12000);
		}).error(function (error) {
			console.log(error);
			addLogItemWithTimeout("Processing queries...",1,2000);
			addLogItemWithTimeout("Query Analyzing failed...",0,4000);
		});
	}

	$scope.stopAnalyzer = function() {
		addLogItem("Stop Analyzer",2);
	}

	$scope.viewAnalyzerResults = function() {
		addLogItem("View Analyzer Results",2);
	}

}]);