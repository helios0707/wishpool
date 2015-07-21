angular.module('wishpool').controller('activitiesController', ['$scope', '$http', 'sharedService', '$filter', '$window',
    function ($scope, $http, sharedService, $filter, $window) {

        // bubble Generator
        var diameter = $window.innerWidth,
            format = d3.format(",d"),
            color = d3.scale.category20c();

        var bubble = d3.layout.pack()
            .sort(null)
            .size([diameter, diameter])
            .padding(10);

        var svg = d3.select(".BubbleContainer").append("svg")
            .attr("width", diameter)
            .attr("height", diameter)
            .attr("class", "bubble");

        d3.json("data.json", function (error, root) {
            if (error) throw error;

            var node = svg.selectAll(".node")
                .data(bubble.nodes(classes(root))
                    .filter(function (d) {
                        return !d.children;
                    }))
                .enter().append("g")
                .attr("class", "node")
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

            node.append("title")
                .text(function (d) {
                    return d.className + ": " + format(d.value);
                });

            node.append("circle")
                .attr("r", function (d) {
                    return d.r;
                })
                .style("fill", function (d) {
                    return color(d.packageName);
                });

            node.append("text")
                .attr("dy", ".3em")
                .style("text-anchor", "middle")
                .text(function (d) {
                    return d.className.substring(0, d.r / 3);
                });
        });

        // Returns a flattened hierarchy containing all leaf nodes under the root.
        function classes(root) {
            var classes = [];

            function recurse(name, node) {
                if (node.children) node.children.forEach(function (child) {
                    recurse(node.name, child);
                });
                else classes.push({packageName: name, className: node.name, value: node.size});
            }

            recurse(null, root);
            return {children: classes};
        }

        d3.select(self.frameElement).style("height", diameter + "px");

        $scope.activityFilter = "";
        $scope.showLikedActivityAlert = false;
        // Get all activities and their likes
        var getAllActivities = function () {
            $http.get('http://localhost:3000/activities').
                success(function (data) {
                    $scope.activities = data;
                });
        };
        getAllActivities();

        $scope.likeActivity = function (activity) {
            // increasing likes of the clicked activity
            var activityPatchData = {
                "likes": activity.likes + 1
            };
            $scope.showLikedActivityAlert = false;
            // checking if the logged in user liked this activity before, if he did not add it to his activities and increase activity likes
            sharedService.getCurrentUserData().then(function (data) {
                var userActivities = data.data.activities || [];
                var isLikedActivityInUserData = $filter('filter')(userActivities, {_key: activity._key});
                console.log(isLikedActivityInUserData)
                if (isLikedActivityInUserData == false || isLikedActivityInUserData == undefined) {
                    var addedActivity = {
                        "_key": activity._key,
                        "realName": activity.realName
                    };
                    userActivities.push(addedActivity);
                    var patchedActivities = {"activities": userActivities};
                    $http.patch('http://127.0.0.1:8529/_db/_system/wishpool/users/' + data.data._key, patchedActivities).
                        success(function (data) {
                            $http.patch('http://127.0.0.1:8529/_db/_system/wishpool/activities/' + activity._key, activityPatchData).
                                success(function (data) {
                                    getAllActivities();
                                });
                        });
                } else {
                    $scope.showLikedActivityAlert = true;
                }

            })

        }

    }]);