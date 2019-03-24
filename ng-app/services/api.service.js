angular.module('easishare-plugin').service("APIService", ["$http", function($http){
    var self = this;
    
    self.login = function(userName, password){
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

    let makeRestRequest = function(method, endPoint, data, headers){
        let requestConfig = {
            method: method,
            url: getEndPoint(endPoint)
        }

        if(requestConfig.data){
            requestConfig.data = data;
        };

        if(requestConfig.headers){
            requestConfig.headers = headers;
        };

        return $http(requestConfig);
    }
    
    let getEndPoint = function(api){
        let url = "";
        if(APP_CONFIG.useCORSProxy){
            url = APP_CONFIG.proxyUrl;
        };
        url += APP_CONFIG.apiBaseUrl + api;
        return url;
    }
}]);

angular.module('easishare-plugin').service("SOAPService", ["$soap", function($soap){
    $soa
}])