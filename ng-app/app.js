angular.module('easishare-plugin',['ngRoute', 'angularSoap']);

angular.module('easishare-plugin').controller("AppController", ["$scope", "APIService", function($scope, APIService){
    var $mainCtrl = this;
    let checkAuth = function(){
        // check if logged in
        // if not, redirect to login page
    };
    checkAuth();

    $scope.$on("ShowLoader", function(){
        $mainCtrl.showLoader = true;
    });
    $scope.$on("HideLoader", function(){
        $mainCtrl.showLoader = false;
    });
}]);


angular.module('easishare-plugin').config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl: "./ng-app/pages/auth/auth.html",
        controller: "authController",
        controllerAs: "$ctrl"
    })
    .when("/files", {
        templateUrl: "./ng-app/pages/files/files.html",
        controller: "filesController",
        controllerAs: "$ctrl"
    })
});