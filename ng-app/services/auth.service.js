angular.module('easishare-plugin').service("AuthService", ["APIService", function(APIService){
    var self = this;
    self.restToken = null;
    self.shareToken = null;
    self.shareESToken = null;
    self.storageToken = null;
}]);