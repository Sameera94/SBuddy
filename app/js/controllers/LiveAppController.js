myApp.controller('LiveAppController', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {

	$scope.name = "Live app"
	$scope.altOptimizationData = []
	$scope.imageOptimizationData = []


	var altOptimization = function(replacedBy) {

		$http.post('/version/getAllModifications', {
			replacedBy: replacedBy
		}).success(
			function (data) {
				console.log(data)
				$scope.altOptimizationData = data
			}
		).error(
			function (error) {
				console.log(error);
				addLogItem("Error occured in endpoint-1",0);
			}
		);
	}

	var imageOptimization = function(replacedBy) {

		$http.post('/version/getAllModifications', {
			replacedBy: replacedBy
		}).success(
			function (data) {
				console.log(data)
				$scope.imageOptimizationData = data
			}
		).error(
			function (error) {
				console.log(error);
				addLogItem("Error occured in endpoint-1",0);
			}
		);
	}

	var restoreStaticContents = function(id) {

		$http.post('/static/restoreStaticContents', {
			udateId: id
		}).success(
			function (data) {
				console.log(data);
			}
		).error(
			function (error) {
				console.log(error);
				addLogItem("Error occured in endpoint-1",0);
			}
		);
	}
	
	$scope.acceptChange = function(id){
		$http.post('/version/acceptChange', {
			id: id
		}).success(
			function (data) {
				reloadPageData()
			}
		).error(
			function (error) {
				console.log(error);
				addLogItem("Error occured in endpoint",0);
			}
		);
	}

	$scope.rejectChange = function(id){
		$http.post('/version/rejectChange', {
			id: id
		}).success(
			function (data) {
				restoreStaticContents(id)
				reloadPageData()
			}
		).error(
			function (error) {
				console.log(error);
				addLogItem("Error occured in endpoint",0);
			}
		);
	}


	var reloadPageData = function() {
		altOptimization("Altre tag optimization")
		imageOptimization("Image Optimization")
	}


	reloadPageData()


}]);