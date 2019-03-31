angular.module('easishare-plugin',['ngRoute', 'angularSoap']);

angular.module('easishare-plugin').controller("AppController", ["$scope", "APIService", "AuthService", "$location", function($scope, APIService, AuthService, $location){
    var $mainCtrl = this;

    $mainCtrl.signOut = function(){
        AuthService.setRestToken(null);
        AuthService.setShareToken(null);
        AuthService.setStorageToken(null);
        $location.path("/");
    };
    let checkAuth = function(){
        // check if logged in
        // if not, redirect to login page
        AuthService.validateTokens()
        .then(()=>{
          $location.path("files");  
        }, err=>{
            $mainCtrl.signOut();
        });
    };
    checkAuth();

    $scope.$on("ShowLoader", function(){
        $mainCtrl.showLoader = true;
    });
    $scope.$on("HideLoader", function(){
        $mainCtrl.showLoader = false;
    });
}]);

angular.module('easishare-plugin').directive('onEnterPress', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.onEnterPress);
                });
                event.preventDefault();
            }
        });
    };
});


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