angular.module("easishare-plugin").controller("ShareModalController", ["$scope", function($scope){
    console.log("Share Model Controller");

    var $ctrl = this;

    $ctrl.recipient = {
        "Fullname" : "",
        "Email": "",
        "Mobile": "",
        "RecipientType": "User"
    };

    var expDate = new Date();
    expDate.setDate(expDate.getDate() + 1);

    $ctrl.shareSettings = {
        "OtpRequired": true,
        "ShareMode": "Default",
        "ExpiryDate": expDate,
        "NoExpiry": false,
        "Notifications": "SendAll"
    }

    $ctrl.save = function(){
        //emit share settings to FileController
        $scope.$emit("shareSelectedFiles", {
            recipient: $ctrl.recipient,
            shareSettings: $ctrl.shareSettings
        })
        $ctrl.close();
    };

    $ctrl.close = function(){
        $('#shareModal').modal('hide');
    }
}]);