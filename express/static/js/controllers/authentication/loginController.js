angular.module('wishpool').controller('loginController', ['$scope', '$http', 'sharedService', '$window',
    function ($scope, $http, sharedService, $window) {
        // redirect to profile if user is logged in
        var logged = sharedService.checkLogin();
        if (logged) {
            $window.location.href = '#/groupsNetwork'
        }
        //initializing user object
        $scope.user = {
            name: "",
            pass: ""
        };
        
        // sign in temporary function
        $scope.signIn = function () {
            if ($scope.user.name!=""){
                var user = {
                    "_key": $scope.user.name,
                    "pass": $scope.user.pass
                };
                $http.post('http://localhost:3000/login', user).
                            success(function (data, status, headers, config) {
                                console.log(data);
                                if (data.msg == "loggedin") {
                                    sharedService.registerLoggedUser(data);
                                    $window.location.href = '#/groupsNetwork'
                                } else{
                                    alert("Failed to login")
                                };
                                
                            }).
                            error(function (data, status, headers, config) {
                                console.log(data)
                                alert("user not found")
                            })               

            }else{
                alert('You have to fill user name first');
            }

        }
    }]);