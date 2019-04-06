angular.module('easishare-plugin').controller("authController", ["APIService", "AuthService", "$scope", "$location", function(APIService, AuthService, $scope, $location){
    console.log("Auth Controller loaded");
    var $ctrl = this;
    
    $ctrl.doLogin = function(){
        $scope.$emit("ShowLoader",{});
        restLogin($ctrl.userName, $ctrl.password)
        .then(data=>{
            let restToken = data.data.Token;
            if(!restToken){
                $scope.$emit("HideLoader",{});
                throw "Invalid Login";
            }
            AuthService.setRestToken(restToken);
            return restToken;
        })
        .then(()=>shareLogin($ctrl.userName, $ctrl.password))
        .then(data=>{
            let shareToken = data.Result;
            if(!shareToken || typeof(shareToken)!="string"){
                $scope.$emit("HideLoader",{});
                throw "Invalid Login";
            }
            AuthService.setShareToken(shareToken);
            return shareToken;
        })
        .then(()=>{
            return updateShareToken(AuthService.getShareToken())
        })
        .then(()=>{
            return APIService.getPolicy(AuthService.getShareToken());
        })
        .then(data=>{
            if(data.Result && data.Result.length && data.Result[2].length && data.Result[2][0].Id){
                return AuthService.setStorageId(data.Result[2][0].Id);
            }
            throw "Invalid Login";
            /* let storageId = data.match(/<StorageSpaceId>(.+?)<\/StorageSpaceId>/);
            if(storageId && storageId.length >= 2){
                return AuthService.setStorageId(storageId[1]);
            }
            throw "Invalid Login"; */
        })
        .then(()=>{
            storageLogin(AuthService.getShareToken(), parseInt(AuthService.getStorageId()))
            .then(data=>{
                let storageToken = data.Result;
                if(!storageToken){
                    $scope.$emit("HideLoader",{});
                    throw "Invalid Login";
                }
                AuthService.setStorageToken(storageToken);
                $location.path("/files")
            });
        }).catch(e=>{
            $scope.$emit("HideLoader",{});
            alert(e);
        });
        /* APIService.restLogin($ctrl.userName, $ctrl.password)
        .then(data => {
            console.log(data);
            let token = data.data.token;
            AuthService.restToken = token;
            APIService.shareLogin($ctrl.userName, $ctrl.password)
            .then(data=>{
                console.log(data);
            })
            // succesful login
            // save token to key store
            // redirect to files page
        }, function(error){
            // invalid login
        }); */
    }
    
    let restLogin = function(userName, password){
        return APIService.restLogin(userName, password);
    };
    
    let shareLogin = function(userName, password){
        return APIService.shareLogin(userName, password);
    };
    
    let updateShareToken = function(token){
        return APIService.getDeviceStatus(token);
    };
    
    let storageLogin = function(esToken, storageId){
        return APIService.storageLogin(esToken, storageId);
    };
    
}]);