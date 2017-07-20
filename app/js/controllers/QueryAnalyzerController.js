myApp.controller('QueryAnalyzerController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function ($scope, $http, $location, $routeParams, $timeout) {

	$scope.queryData = []
	var isListening = false;
	$scope.logsArray = []

	$scope.spinerOfAnalyzer = true;

	$scope.spinerOfEndPointOne = true;
	$scope.spinerOfEndPointTwo = true;

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

		$scope.logsArray.unshift({
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
		$scope.spinerOfAnalyzer = false;

		$http.get('/sql/startAnalyzer', {
		}).success(function (data) {

			addLogItemWithTimeout("Processing queries...",1,2000);
			addLogItemWithTimeout("Remove duplicate records...",1,4000);
			addLogItemWithTimeout("Sumarizing final records...",1,6000);
			addLogItemWithTimeout("Executing queries & save results...",1,9000);
			addLogItemWithTimeout("Processing final records...",1, 11000)
			addLogItemWithTimeout("Query Analyzing completed...",1,12000);

			$timeout(function() {
            	$scope.spinerOfAnalyzer = true;
       		}, 12000);

		}).error(function (error) {
			console.log(error);
			addLogItemWithTimeout("Processing queries...",1,2000);
			addLogItemWithTimeout("Query Analyzing failed...",0,4000);
		});
	}

	$scope.stopAnalyzer = function() {
		addLogItem("Stop Analyzer",2);
		$scope.spinerOfAnalyzer = true;
	}

	$scope.viewAnalyzerResults = function() {
		addLogItem("View Analyzer Results",2);
	}

	$scope.cleanQueryLog = function() {
		addLogItem("Cleaning query logs...",2);
		$http.get('/sql/cleanGenaralLogs', {
		}).success(function (data) {
			addLogItem("Query Logs cleaned",2);
		}).error(function (error) {
			console.log(error);
		});
	}

	$scope.checkForReplacement = function() {
		addLogItem("Checking for the replacement...",2);
		$scope.spinerOfEndPointOne = false;

		$http.post('/sql/isReplacePosible', {
			searchString: $scope.textString
		}).success(
			function (data) {
				if(data == "true") {
					$timeout(function() {
		            	addLogItem("Replaement is posibble...",1);
						$scope.spinerOfEndPointOne = true;
		       		}, 3000);

				} else {
					$timeout(function() {
		            	addLogItem("Replaement is not posibble...",0);
						$scope.spinerOfEndPointOne = true;
		       		}, 3000);
				}	
			}
		).error(
			function (error) {
				console.log(error);
				addLogItem("Error occured in endpoint-1",0);
			}
		);
	}

	$scope.doTheReplacement = function() {
		addLogItem("Connecting replacement component...",2);
		$scope.spinerOfEndPointTwo = false;

		$http.post('/sql/replaceString', {
			searchString : $scope.textString,
			newString	 : $scope.updatedString
		}).success(
			function (data) {
				if(data == "true") {
					$timeout(function() {
		            	addLogItem("Successfully replced!",1);
						$scope.spinerOfEndPointTwo = true;
		       		}, 3000);
				} else {
					$timeout(function() {
		            	addLogItem("Replaement failed",0);
						$scope.spinerOfEndPointTwo = true;
		       		}, 3000);
				}	
			}
		).error(
			function (error) {
				console.log(error);
				addLogItem("Error occured in endpoint-2",0);
			}
		);
	}
	
	
	

}]);