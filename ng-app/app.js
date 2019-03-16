angular.module('easishare-plugin',['ngRoute']);


angular.module('easishare-plugin').config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl: "./ng-app/pages/auth/auth.html",
        controller: "authController"
    })
    .when("/files", {
        templateUrl: "./ng-app/pages/files/files.html",
        controller: "filesController"
    })
});


