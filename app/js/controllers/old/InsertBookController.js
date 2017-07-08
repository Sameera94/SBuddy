myApp.controller('InsertBookController', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {

	$scope.name = "sameera";
	$scope.bookId = 0




	$scope.insertNewBook = function () {
		$http.post('/lbs/createBook', {
			name: $scope.data.name,
			author: $scope.data.author
		}).success(
			function (data) {
				console.log(data)
				getAllBooks();
			}
			).error(
			function (error) {
				console.log(error);
			}
			);
	};

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


}]);