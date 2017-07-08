myApp.controller('UsersController', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {

	$scope.insertNewUser = function () {
		$http.post('/lbs/createUser', {
			fname	: $scope.data.fname,
			lname	: $scope.data.lname,
			phone	: $scope.data.phone,
			email	: $scope.data.email,
			address	: $scope.data.address
		}).success(
			function (data) {
				console.log(data)
				getAllUsers();
			}
		).error(
			function (error) {
				console.log(error);
			}
		);
	};

	var getAllUsers = function(){
		$http.post('/lbs/getAllUsers', {
		}).success(
			function (data) {
				$scope.usersList = data
			}
		).error(
			function (error) {
				console.log(error);
			}
		);
	}

	getAllUsers();

}]).controller('BorrowController', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {

	$scope.borrowBook = function () {

		$http.post('/lbs/borrowBook', {
			book	: $scope.data.borrowBook,
			user	: $scope.data.userID
		}).success(
			function (data) {
				console.log(data)
				getAllBorrows();
			}
		).error(
			function (error) {
				console.log(error);
			}
		);

	}


	var getAllUsers = function(){
		$http.post('/lbs/getAllUsers', {
		}).success(
			function (data) {
				$scope.usersList = data
			}
		).error(
			function (error) {
				console.log(error);
			}
		);
	}
	getAllUsers();

	var getAllBooks = function(){
		$http.post('/lbs/getAllBooks', {
		}).success(
			function (data) {
				$scope.booksList = data
			}
		).error(
			function (error) {
				console.log(error);
			}
		);
	}
	getAllBooks();

	var getAllBorrows = function(){
		$http.post('/lbs/getAllBorrows', {
		}).success(
			function (data) {
				$scope.borrowList = data
			}
		).error(
			function (error) {
				console.log(error);
			}
		);
	}
	getAllBorrows();

	

}]);