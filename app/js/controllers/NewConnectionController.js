myApp.controller('NewConnectionController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function ($scope, $http, $location, $routeParams, $timeout) {

	$scope.logsArray = []
	$scope.ip 		= "10.52.209.6"
	$scope.username = "sysadmin"
	$scope.password = "3college!"

	$scope.spinerOfFileSystem = true;
	$scope.spinerOfConnection = true;

	var getFolderStructure = function () {
		$http.get('/connection/getTreeStructureFromRemoteServer', {
		}).success(function (data) {
			$scope.treedata = data
			addLogItem("Connected to file system!",1)
			$scope.spinerOfFileSystem = true;
		}).error(function (error) {
			console.log(error);
		});
	}

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

	//getFolderStructure();
	
	$scope.refreshFileList = function () {
		getFolderStructure();
	}

	$scope.downloadFolder = function(path) {
		addLogItem("Downloading folder "+path,2);
		$scope.spinerOfFileSystem = false;

		$http.post('/connection/downloadFolder', {
			path: path
		}).success(
			function (data) {
				if(data == "success") {
					addLogItem("Successfully downloaded "+path,1);
					$scope.spinerOfFileSystem = true;
				} else {
					addLogItem(path+" downloading failed!",0);
					$scope.spinerOfFileSystem = true;
				}	
			}
		).error(
			function (error) {
				console.log(error);
				addLogItem(path+" downloading failed!",0);
				$scope.spinerOfFileSystem = true;
			}
		);
	}

	$scope.onClickConnectToServer = function(){
		$scope.spinerOfConnection = false;
		addLogItem("Connecting...",2);

		$http.post('/connection/setupConnection', {
			ip: $scope.ip,
			username: $scope.username,
			password: $scope.password
		}).success(
			function (data) {
				console.log(data)
			}
		).error(
			function (error) {
				console.log(error);
			}
		);

		$timeout(function() {
            $scope.spinerOfConnection = true;
        }, 5000);

        $timeout(function() {
            $scope.spinerOfFileSystem = false;
        }, 7000);
		
		addLogItemWithTimeout("Connected!",1,5000);
		addLogItemWithTimeout("Connecting to file system...",2,7000);
		$timeout(function() {
            getFolderStructure();
        }, 8000);
	}

}]);