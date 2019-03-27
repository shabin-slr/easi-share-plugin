angular.module('easishare-plugin').controller("filesController", ["$scope","AuthService", "APIService", function($scope, AuthService, APIService){
    console.log("Files Controller loaded");
    var $ctrl = this;

    $ctrl.path = "";
    $ctrl.folderStack = [];

    $ctrl.getFiles = function(){
        $scope.$emit("ShowLoader",{});
        APIService.getFileList($ctrl.path, AuthService.getStorageToken())
        .then(data=>{
            console.log(data);
            $ctrl.files = data.Result;
            $scope.$emit("HideLoader",{});
        });
    };

    $ctrl.goToDirectory = function(file){
        if(!file.isDirectory){
            return;
        }
        $ctrl.folderStack.push(file.fileName);
        $ctrl.path = $ctrl.folderStack.join("/");
        $ctrl.files = [];
        $ctrl.getFiles();
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
            $ctrl.files = [];
            $ctrl.getFiles();
            return;
        }
        $ctrl.folderStack.length = $index+1;
        $ctrl.path = $ctrl.folderStack.join("/");
        $ctrl.files = [];
        $ctrl.getFiles();
    };

    $ctrl.getFileType = function(file){
        if(file.fileName.indexOf(".") == -1){
            return "";
        }
        return file.fileName.substring(file.fileName.lastIndexOf(".")+1, file.fileName.length);
    };

    $ctrl.getFileSize = function(bytes){
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        if (i == 0) return bytes + ' ' + sizes[i];
        return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
    };

    $ctrl.showFileSelect = function(){
        console.log("clikced");
        document.getElementById("file1").click();
    }

    $ctrl.handleFileAdd = function(element){
        $ctrl.element = element;
        if(element.files.length){
            $ctrl.fileToUpload = element.files[0];

            var fd = new FormData();
            fd.append("files", $ctrl.fileToUpload);//, $ctrl.fileToUpload.name
            var path = $ctrl.path;
            if(path) path+="/";
            var params = {
                Token: AuthService.getStorageToken(),
                FullSize: $ctrl.fileToUpload.size,
                path: path+ $ctrl.fileToUpload.name
            }
            $scope.$emit("ShowLoader",{});
            APIService.uploadFile(fd, params)
            .then(data=>{
                console.log(data);
                $ctrl.getFiles();
            });
        }
        /* `$scope.$apply(function(scope){
            console.log('files:', element.files);
            $ctrl.files = [];
            for (var i = 0; i < element.files.length; i++) {
                element.files[i].status = "queued";
                $ctrl.files.push(element.files[i]);
            }
        });` */
    };

    (()=>{
        $ctrl.getFiles();
    })();

}])