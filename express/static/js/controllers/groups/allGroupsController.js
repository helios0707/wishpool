angular.module('wishpool').controller('allGroupsController', ['$scope', '$http', 'sharedService',
    function ($scope, $http, sharedService) {
                var checkingUserExistanceInGroups = [];
                var currentUser = JSON.parse(sharedService.checkLogin());
                    $http.get('http://localhost:3000/groups').
                        success(function (data) {
                            $scope.groups=data;
                        })
    }]);