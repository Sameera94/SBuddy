myApp.controller('NewConnectionController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function ($scope, $http, $location, $routeParams, $timeout) {

	$scope.logsArray = []
	$scope.ip 		= "10.52.209.6"
	$scope.username = "sysadmin"
	$scope.password = "3college!"

	$scope.spinerOfFileSystem = true;
	$scope.spinerOfConnection = true;

	$scope.treedata = [];
	$scope.selectedFolderPath = ""
	$scope.currentLocation = ""

	var initialPath = "/home/sysadmin"
	var pathArray   = ["home","sysadmin"]

	var previousFolder = ""
	var selectedFolderName = ""

	var getFolderStructure = function (path) {
		$scope.spinerOfFileSystem = false;
		addLogItem("Listing directory contents...",2)
		
		$http.post('/connection/getFilesHeirachyOfGivenDirectory', {
			path: path
		}).success(function (data) {
			var dataArray = []
			for (var i=0; i<data.length; i++) {
				if(data[i].type == 0){
					dataArray.push(data[i])	
				}
   			}
			for (var i=0; i<data.length; i++) {
				if(data[i].type == 1){
					dataArray.push(data[i])	
				}
   			}
			$scope.treedata = dataArray
			addLogItem("Directory listing completed!",1)
			$scope.currentLocation = getCurrentPath();
			$scope.spinerOfFileSystem = true;
		}).error(function (error) {
			console.log(error);
		});
	}

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

	var getCurrentPath = function() {
		var path = ""	
		for (var i=0; i<pathArray.length; i++) {
      		path = path + "/" + pathArray[i]
   		}
		return path
	}

	//getFolderStructure();
	
	$scope.refreshFileList = function () {
		pathArray = ["home","sysadmin"]
		getFolderStructure(initialPath);
	}

	$scope.downloadFolder = function(path) {
		addLogItem("Downloading folder "+path,2);
		$scope.spinerOfFileSystem = false;

		$http.post('/connection/downloadFolder', {
			path: path,
			name: selectedFolderName 
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
        }, 6000);
		
		addLogItemWithTimeout("Connected!",1,5000);
		addLogItemWithTimeout("Connecting to file system...",2,6000);
		$timeout(function() {
			pathArray = ["home","sysadmin"]
            getFolderStructure(initialPath);
        }, 7000);
	}

	$scope.singleClickOnFile = function(path) {
		$scope.selectedFolderPath = getCurrentPath()+"/"+path
		selectedFolderName = path
	}

	$scope.doubleClickOnFile = function(path) {
		addLogItem("Loading folder heirachy of the "+getCurrentPath()+"/"+path+"...",2)
		getFolderStructure(getCurrentPath()+"/"+path);
		pathArray.push(path)
	}

	$scope.backButtonClick = function() {
		if(pathArray.length > 0){
			previousFolder = pathArray.pop();
			getFolderStructure(getCurrentPath())
		}
	}

	$scope.nextButtonClick = function() {
		if(previousFolder != ""){
			getFolderStructure(getCurrentPath()+"/"+previousFolder);
			pathArray.push(previousFolder)
		}
	}

	$scope.clearLog = function() {
		$scope.logsArray = []
	}

}]);