angular.module('easishare-plugin').service("AuthService", [function(){
    var self = this;
    self.restToken = null;
    self.shareToken = null;
    self.shareESToken = null;
    self.storageToken = null;

    self.setRestToken = function(token){
        localStorage.setItem("restToken", token);
    };

    self.getRestToken = function(){
        return localStorage.getItem("restToken")
    };

    self.setShareToken = function(token){
        localStorage.setItem("shareToken", token);
    };

    self.getShareToken = function(){
        return localStorage.getItem("shareToken");
    };

    /* self.setShareESToken = function(token){
        localStorage.setItem("shareESToken", token);
    };

    self.getShareESToken = function(){
        localStorage.getItem("shareESToken");
    }; */

    self.setStorageToken = function(token){
        localStorage.setItem("storageToken", token);
    };

    self.getStorageToken = function(){
        return localStorage.getItem("storageToken");
    };
}]);