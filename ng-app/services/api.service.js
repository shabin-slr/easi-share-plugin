angular.module('easishare-plugin').service("APIService", ["$http", "$soap", function($http, $soap){
    var self = this;
    
    self.restLogin = function(userName, password){
        return makeRestRequest(
            "POST",
            REST_END_POINTS.LOGIN,
            {
                "UserName": userName,
                "UserPassword": password,
                "HTTPResponseType": "JSON"
            }
        );
    };

    self.shareLogin = function(userName, password){
        return makeSoapRequest(
            SOAP_END_POINTS.SHARE,
            "Login",{
                "Username": userName,
                "Password": password,
                "Options": {
                    "DeviceID" : APP_CONFIG.soap.deviceID,
                    "DeviceType": APP_CONFIG.soap.deviceType,
                    "AppVersion" : APP_CONFIG.soap.appVersion,
                    "HTTPResponseType": "XML"
                }
            }
        );
    };

    self.getDeviceStatus = function(token){
        return makeSoapRequest(
            SOAP_END_POINTS.SHARE,
            "GetDeviceStatus",{
                "Options":{
                    "Token": token,
                    "NewErrorCodes": true
                }
            }
        );
    };

    self.storageLogin = function(esToken, storageId){
        return makeSoapRequest(
            SOAP_END_POINTS.STORAGE,
            "Login",{
                "ESToken": esToken,
                "Options": {
                    "StorageID": storageId
                }
            }
        );
    };

    self.getFileList = function(path, token){
        return makeSoapRequest(
            SOAP_END_POINTS.STORAGE,
            "GetFiles",{
                "Path": path,
                "Options": {
                    "Token": token
                }
            }
        );
    };

    let makeRestRequest = function(method, endPoint, data, headers){
        let requestConfig = {
            method: method,
            url: getRestEndPoint(endPoint)
        }

        if(requestConfig.data){
            requestConfig.data = data;
        };

        if(requestConfig.headers){
            requestConfig.headers = headers;
        };

        return $http(requestConfig);
    }

    let makeSoapRequest = function(endPoint, functionName, data){
        return $soap.post(getSoapEndPoint(endPoint), functionName, data);
    }
    
    let getRestEndPoint = function(api){
        let url = "";
        if(APP_CONFIG.useCORSProxy){
            url = APP_CONFIG.proxyUrl;
        };
        url += APP_CONFIG.rest.apiBaseUrl + api;
        return url;
    }

    let getSoapEndPoint = function(api){
        let url = "";
        if(APP_CONFIG.useCORSProxy){
            url = APP_CONFIG.proxyUrl;
        };
        url += APP_CONFIG.apiBaseUrl + api;
        return url;
    }

}]);


/* var a = $soap.post("https://gdps-url-validator.herokuapp.com/https://demo2.easishare.com/esws/Share.asmx",
"Login",
           {
	"Username": "apidev1",
	"Password": "12345678",
	"Options": {
	"DeviceID" : "1234",
	"DeviceType": "API",
	"AppVersion" : "1.0",
	"HTTPResponseType": "XML"
}
})
a.then(x=>console.log(x)) */