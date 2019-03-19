angular.module('easishare-plugin').controller("authController", ["APIService", function(APIService){
    console.log("Auth Controller loaded");
    var $ctrl = this;
    
    $ctrl.doLogin = function(){
        APIService.login($ctrl.userName, $ctrl.password)
        .then(function(data){
            console.log(data);
            // succesful login
            // save token to key store
            // redirect to files page
        }, function(error){
            // invalid login
        });
    }
}]);