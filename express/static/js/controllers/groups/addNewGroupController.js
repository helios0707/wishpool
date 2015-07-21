angular.module('wishpool').controller('addNewGroupController', ['$scope', '$http','sharedService','$window',
    function ($scope, $http,sharedService,$window) {
    $scope.newGroupModel = {
        groupName: "",
        activities: []
    };
        $scope.createGroupSuccess=false;
    $scope.dirty = {};
    $http.get('http://localhost:3000/activities').
        success(function (data) {
            function suggest_activity(term) {
                var q = term.toLowerCase().trim();
                var results = [];
                // Find first 10 states that start with `term`.
                for (var i = 0; i < data.length && results.length < 50; i++) {
                    var activity = data[i].realName;
                    if (activity.toLowerCase().indexOf(q) === 0)
                        results.push({label: data[i].realName, value: data[i]._key});
                }
                return results;
            }

            function addActivity(selected) {
                var selectedActivity = {
                    "_key": selected.value,
                    "realName": selected.label
                };
                $scope.newGroupModel.activities.push(selectedActivity);
                // Clear model
                $scope.dirty.selected_tag = undefined;
            };

            $scope.ac_option_activity_select = {
                suggest: suggest_activity,
                on_select: addActivity
            };
        });
    $scope.addNewGroup = function () {
        var groupKeyName = sharedService.getKeyString($scope.newGroupModel.groupName);
        $http.get('http://localhost:3000/groups/'+groupKeyName).
            success(function (data) {
                $scope.createGroupError="There is another group with the same name, Please choose another Name!"
            }).error(function (data) {
                var newGroup={
                    "_key":groupKeyName,
                    "realName":$scope.newGroupModel.groupName.trim(),
                    "activities":$scope.newGroupModel.activities
                };
                $http.post('http://localhost:3000/groups',newGroup).
                    success(function (data) {
                        $scope.newGroupModel = {
                            groupName: "",
                            activities: []
                        };
                        $scope.createGroupSuccess=true;
                        $window.location.href='#/#allGroups';
                    }

                )
            })
    }

}]);