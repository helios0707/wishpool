angular.module('wishpool').controller('profileController',['$scope','$http','sharedService',
    function ($scope,$http,sharedService) {
    sharedService.getCurrentUserData().then(function (data) {
        $scope.activities=data.data.activities;
    })

}]);