myApp.controller('VersionController', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {

	$scope.name = "File changed history"
	$scope.fileData = []


	var getFiles = function() {	
		$http.get('/version/getFiles', {
		}).success(function (data) {

			for (var i=0; i<data.length; i++) {	
				
				var fileinfo = data[i]

				$http.post('/version/getFileUpdates', {
					
					fileId: data[i].id

				}).success(function (d) {
					$scope.fileData.push([{
						"file": fileinfo,
						"subFiles": d
					}]);
				}).error(function (error) {
					console.log(error);
				});
			}

			
		}).error(function (error) {
			console.log(error);
		});
	}

	var getFileUpdates = function(fileId) {	
		$http.post('/version/getFileUpdates', {
			fileId: fileId
		}).success(function (data) {
			
		}).error(function (error) {
			console.log(error);
		});
	}

	$scope.ssssss = function() {

		getFiles()
	}


	getFiles()

}]);