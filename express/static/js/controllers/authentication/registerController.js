angular.module('wishpool').controller('registerController',['$scope', '$http', 'sharedService', '$window',
    function ($scope, $http, sharedService, $window) {
    
    // Register temporary function
    $scope.register = function () {
        if ($scope.user.email!=""){
            // check the existence of this user
        	$http.get('http://localhost:3000/users/' + $scope.user.email).
                success(function (data, status, headers, config) {
                    // if this is a current user create a session with user email and redirect to it's profile
                    console.log(data);
                    sharedService.registerLoggedUser(data);
                    $window.location.href = '#/activities'
                }).
                error(function (data, status, headers, config) {
                    // if it is a new user add it to the database then redirect it to it's profile
                    console.log(data);
                    var newUser={
				        "_key": $scope.user.email,
                        "firstName": $scope.user.firstname,
				        "lastName": $scope.user.lastname,
				        "email": $scope.user.email,
				        "password": $scope.user.pass
				    }

                    console.log(newUser);
                    
                    $http.post('http://localhost:3000/users', newUser).
                        success(function (data, status, headers, config) {
                            console.log(data);
                            sharedService.registerLoggedUser(data);
                            $window.location.href = '#/activities'
                        }).
                        error(function (data, status, headers, config) {
                            console.log(data)
                        })
                });
        }else{
            alert('You have to fill user email first');
        }

    }

}]);