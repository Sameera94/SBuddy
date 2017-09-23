myApp.controller('VersionController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function ($scope, $http, $location, $routeParams, $timeout) {

	$scope.name = "File changed history"
	$scope.fileData = []
	
	var projectLocation = "/home/sameera/Desktop/SEPTEMBER/Adminmaria/"

	var getFiles = function() {	
		$http.get('/version/getSubs', {
		}).success(function (data) {
			$scope.fileData = data;
		}).error(function (error) {
			console.log(error);
		});
	}

	var pooling = function() {
	 	getFiles();
	 	$timeout(pooling, 5000);
	};

	pooling()

	$scope.restoreUpdate = function(id) {
		console.log("restore update "+ id)
	}

	$scope.restoreFile = function(id) {
		console.log("restore file " +id)
	}

	$scope.restoreFile = function(fileId) {

		var result = confirm("Are you sure want to restore file?");
		if (result) {
			$http.post('/fileMonitor/restoreFileIntoOriginalState', {
				fileId: fileId,
				path: projectLocation
			}).success(
				function (data) {
					if(data == "success") {
						console.log("Restored!");
					}
				}
			).error(
				function (error) {
					console.log(error);
					addLogItem("Error occured in endpoint-1",0);
				}
			);
		}
	}
}]);