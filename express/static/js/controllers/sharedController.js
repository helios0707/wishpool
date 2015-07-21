angular.module('wishpool').controller('sharedController', ['$scope', '$window', '$http', 'sharedService',
    function ($scope, $window, $http, sharedService) {
        $scope.showNav = function(){
            var logged = sharedService.checkLogin();
            if (logged){
                return true
            }
            else{
                return false
            }
        };

        $scope.signOut = function () {
            $http.post('http://localhost:3000/signout', {}).
                            success(function (data, status, headers, config) {
                                console.log(data);
                                if (data.msg == "signed out") {
                                    localStorage.removeItem('wishpoolUser');
                                    $window.location.href = '#/'                                                            
                                } else{
                                    alert("Failed to sign out")
                                };
                                
                            }).
                            error(function (data, status, headers, config) {
                                console.log(data)
                                alert("Internal server error")
                            })               
            
        }
    }]);