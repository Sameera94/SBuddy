myApp.controller('HomeController', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {

	var getAllBooks = function () {
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