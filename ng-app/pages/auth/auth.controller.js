angular.module('easishare-plugin').controller("authController", ["APIService", "AuthService", "$q", "$location", function(APIService, AuthService, $q, $location){
    console.log("Auth Controller loaded");
    var $ctrl = this;
    
    $ctrl.doLogin = function(){
        
        restLogin($ctrl.userName, $ctrl.password)
        .then(data=>{
            let restToken = data.data.Token;
            if(!restToken){
                throw "Invalid Login";
            }
            AuthService.setRestToken(restToken);
            return restToken;
        })
        .then(()=>shareLogin($ctrl.userName, $ctrl.password))
        .then(data=>{
            let shareToken = data;
            if(!shareToken || typeof(data)!="string"){
                throw "Invalid Login";
            }
            AuthService.setShareToken(shareToken);
        })
        .then(updateShareToken(AuthService.getShareToken())
        ).then(()=>{
            storageLogin(AuthService.getShareToken())
            .then(data=>{
                let storageToken = data.Result;
                if(!shareToken){
                    throw "Invalid Login";
                }
                AuthService.setStorageToken(storageToken);
                $location.path("/files")
            })
        }).catch(e=>{
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

    let storageLogin = function(esToken){
        return APIService.storageLogin(esToken);
    }

}]);