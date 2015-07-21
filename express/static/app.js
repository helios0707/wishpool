angular.module('wishpool', ['ui.router','ngSanitize', 'MassAutoComplete'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/authentication/login.html',
                controller: 'loginController'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'views/authentication/register.html',
                controller: 'registerControllers'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'views/user/profile.html',
                controller: 'profileController'
            })
            .state('activities', {
                url: '/activities',
                templateUrl: 'views/activities/activities.html',
                controller: 'activitiesController'
            })
            .state('addNewGroup', {
                url: '/addNewGroup',
                templateUrl: 'views/groups/addNewGroup.html',
                controller: 'addNewGroupController'
            })
            .state('allGroups', {
                url: '/allGroups',
                templateUrl: 'views/groups/allGroups.html',
                controller: 'allGroupsController'
            })
            .state('groupsNetwork', {
                url: '/groupsNetwork',
                templateUrl: 'views/groups/groupsNetwork.html',
                controller: 'groupsNetworkController'
            })
    });