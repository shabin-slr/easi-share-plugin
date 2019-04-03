angular.module("easishare-plugin").controller("MoveFileController", ["$scope", "APIService", "AuthService", "$location", function($scope, APIService, AuthService, $location){
    console.log("Share Model Controller");

    var $ctrl = this;
    $ctrl.path = "";
    $ctrl.selectedPath = "";
    $ctrl.folderStack = [];
    $ctrl.folders = [];

    $ctrl.getFolders = function(){
        $scope.$emit("ShowLoader",{});
        $ctrl.loadStatus = "Getting Folders.."
        APIService.getFileList($ctrl.path, AuthService.getStorageToken())
        .then(data=>{
            console.log(data);
            if(data.ErrorMessage){
                $('.modal').modal('hide');
                $location.path("/");
                return;
            }
            if(!!data.Result){
                $ctrl.folders = data.Result.filter(x=>x.isDirectory);
            }
            if(!$ctrl.folders.length){
                $ctrl.loadStatus = "Empty";
            }
            $scope.$emit("HideLoader",{});
        });
    };

    $ctrl.goToDirectory = function(folder){
        $ctrl.folderStack.push(folder.fileName);
        $ctrl.path = $ctrl.folderStack.join("/");
        $ctrl.folders = [];
        $ctrl.getFolders();
        $ctrl.selectFolder(folder);
    };

    $ctrl.gotToPath = function($index){
        if($index >= $ctrl.folderStack.length-1){
            return;
        }
        if($index == -1){
            if($ctrl.path == ""){
                return;
            }
            $ctrl.folderStack = [];
            $ctrl.path = "";
            $ctrl.folders = [];
            $ctrl.getFolders();
            return;
        }
        $ctrl.folderStack.length = $index+1;
        $ctrl.path = $ctrl.folderStack.join("/");
        $ctrl.folders = [];
        $ctrl.getFolders();
    };

    $ctrl.selectFolder = function(folder){
        var path = "";
        /* $ctrl.path;
        if(!!$ctrl.path){
            path+= "/";
        } */
        path = path + $ctrl.folderStack.join("/") + "/" + folder.fileName;
        $ctrl.selectedPath = path;
        $ctrl.folders.forEach(x=>x.isSelected = false);
        folder.isSelected = true;
    };

    $ctrl.copy = function(){
        $scope.$emit("copySelectedToPath",{
            destination: $ctrl.path
        });
    };

    $ctrl.move = function(){
        $scope.$emit("moveSelectedToPath",{
            destination: $ctrl.path
        });
    };

    (()=>$ctrl.getFolders())();

}]);