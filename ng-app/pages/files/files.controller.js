angular.module('easishare-plugin').controller("filesController", ["AuthService", "APIService", function(AuthService, APIService){
    console.log("Files Controller loaded");

    APIService.getFileList("", AuthService.getStorageToken())
    .then(data=>{
        console.log(data);
    })
}])