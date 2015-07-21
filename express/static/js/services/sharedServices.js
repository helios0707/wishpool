angular.module('wishpool').service('sharedService',['$window','$http',function ($window,$http) {
    // checking if there is a logged user and getting it's name
    this.checkLogin= function () {
        var loggedUser = $window.localStorage.getItem("wishpoolUser");
        return loggedUser;
    };
    //registering looged user data in the local Storage
    this.registerLoggedUser=function(userObject){
        $window.localStorage.setItem('wishpoolUser',JSON.stringify(userObject));
        return true;
    }
    this.getCurrentUserData=function(){
        var currentUser = this.checkLogin();
        var user = JSON.parse(currentUser)
        return ($http.get('http://127.0.0.1:3000/users/'+user._key));
    }
    this.getKeyString= function (str) {
       var keyString = str.trim().replace(/\s+/g, '').toLowerCase().replace(/[`~!#$%^&*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'');
        return keyString;
    }
}]);