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
        .then(function(){
            $location.path("/files");  
        }, function(err){
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

angular.module('easishare-plugin').filter("groupBy",["$parse","$filter",function($parse,$filter){
    return function(array,groupByField){
        var result	= [];
        var prev_item = null;
        var groupKey = false;
        var filteredData = $filter('orderBy')(array,groupByField) || [];
        for(var i=0;i<filteredData.length;i++){
            groupKey = false;
            if(prev_item !== null){
                if(prev_item[groupByField] !== filteredData[i][groupByField]){
                    groupKey = true;
                }
            } else {
                groupKey = true;  
            }
            if(groupKey){
                filteredData[i]['group_by_key'] =true;  
            } else {
                filteredData[i]['group_by_key'] =false;  
            }
            result.push(filteredData[i]);
            prev_item = filteredData[i];
        }
        return result;
    }
}]);