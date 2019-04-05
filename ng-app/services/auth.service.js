angular.module('easishare-plugin').service("AuthService", ["$q", function($q){
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

    self.setStorageToken = function(token){
        localStorage.setItem("storageToken", token);
    };

    self.getStorageToken = function(){
        return localStorage.getItem("storageToken");
    };

    self.setStorageId = function(token){
        localStorage.setItem("storageId", token);
    };

    self.getStorageId = function(){
        return localStorage.getItem("storageId");
    };

    self.validateTokens = function(){
        if(!self.getRestToken() || !self.getShareToken() || !self.getStorageToken()){
            return $q.reject();
        }
        return $q.resolve();
    }
}]);