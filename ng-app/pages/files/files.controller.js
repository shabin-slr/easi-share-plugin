angular.module('easishare-plugin').controller("filesController", ["$scope","AuthService", "APIService", "SharedStore", "$location", "$q", function($scope, AuthService, APIService, SharedStore, $location, $q){
    var $ctrl = this;

    $ctrl.path = "";
    $ctrl.folderStack = [];
    $ctrl.selectedFiles = [];
    $ctrl.fileLoadStatus = "Loading..";

    $ctrl.toggleFileSelect = function(file){
        file.isSelected = !file.isSelected;
        if(file.isSelected){
            $ctrl.selectedFiles.push(file);
        } else {
            $ctrl.selectedFiles = $ctrl.selectedFiles.filter(x=>x.fileUrl != file.fileUrl);
        }
    };

    $ctrl.getFiles = function(){
        $scope.$emit("ShowLoader",{});
        APIService.getFileList($ctrl.path, AuthService.getStorageToken())
        .then(data=>{
            $ctrl.fileLoadStatus = "Loading ...";
            if(data.ErrorMessage){
                $location.path("/");
                $scope.$emit("HideLoader",{});
                $('.modal').modal('hide');
                return;
            }
            $ctrl.selectedFiles = [];
            $ctrl.files = data.Result || [];
            $scope.$emit("HideLoader",{});
            if(!$ctrl.files.length){
                $ctrl.fileLoadStatus = "Folder is empty";
            }
        }); 
    };

    $ctrl.deleteAction = function(){
        $scope.$emit("ShowLoader",{});
        var path = $ctrl.path;
        if(path){
            path+="/"
        }
        var promises = [];
        $ctrl.selectedFiles.forEach(file=>{
            var deletePath = path + file.fileName;
            var deleteAction = file.isDirectory?APIService.deleteFolder:APIService.deleteFile;
            promises.push(deleteAction(deletePath, AuthService.getStorageToken()));
        });
        $q.all(promises)
        .then(data=>{
            $ctrl.getFiles();
        }).catch(e=>{
            console.error(e);
            $ctrl.getFiles();
        });
    };

    $ctrl.createFolder = function(){
        $scope.$emit("ShowLoader",{});
        $ctrl.fileLoadStatus = "Loading ...";
        var path = $ctrl.path;
        if(path){
            path+="/"
        }
        path+=$ctrl.newFolderName;

        APIService.createFolder(path, AuthService.getStorageToken())
        .then(data=>{
            $ctrl.showNewFolderInput = false
            $ctrl.newFolderName = "";
            $ctrl.getFiles();
        })
    };

    $ctrl.startRenameFile = function(file){
        file.editedName = file.fileName 
        file.isRenaming = true;
    }

    $ctrl.updateFileName = function(file){
        $scope.$emit("ShowLoader",{});
        var path = $ctrl.path;
        if(path){
            path+="/"
        }
        APIService.renameFile(path + file.fileName, path + file.editedName, AuthService.getStorageToken())
        .then(data=>{
            file.isRenaming = false;
            $ctrl.getFiles();
        });
    };

    $ctrl.cancelFileUpdate = function(file){
        file.isRenaming = false;
        file.editedName = "";
    };

    $ctrl.goToDirectory = function(file){
        $ctrl.fileLoadStatus = "Loading ...";
        if(!file.isDirectory){
            $ctrl.downloadFile(file);
            return;
        }
        $ctrl.folderStack.push(file.fileName);
        $ctrl.path = $ctrl.folderStack.join("/");
        $ctrl.files = [];
        $ctrl.getFiles();
    };

    $ctrl.gotToPath = function($index){
        $ctrl.fileLoadStatus = "Loading ...";
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
                $ctrl.getFiles();
            });
        }
        /* `$scope.$apply(function(scope){
                        $ctrl.files = [];
            for (var i = 0; i < element.files.length; i++) {
                element.files[i].status = "queued";
                $ctrl.files.push(element.files[i]);
            }
        });` */
    };

    $ctrl.share = function(){
        if(!$ctrl.selectedFiles.length) return;
        $('#shareModal').modal('show');
    };

    $ctrl.showMoveModal = function(){
        if(!$ctrl.selectedFiles.length) return;
        $('#moveFilePopup').modal('show');
    };

    $ctrl.downloadFile = function(file) {
        var link = document.createElement("a");
        link.download = file.fileName;
        var path = $ctrl.path;
        path = path+ (!!path?"/":"") + file.fileName;

        link.href = APIService.getDownloadUrl(path, AuthService.getStorageToken());
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        delete link;
    };

    $scope.$on("shareSelectedFiles", function(event, data){
        console.log(data);
        $scope.$emit("ShowLoader",{});
        APIService.share($ctrl.selectedFiles, data.recipient, data.shareSettings, AuthService.getShareToken())
        .then(data=>{
            console.log(data);
            if(data.SingleLinks && data.SingleLinks.length){
                alert(data.SingleLinks[0]);
                // @TODO, show this in a click copy popup
            } else {
                alert("An error occurred, please try again later");
            }
            $scope.$emit("HideLoader",{});
        }).catch(e=>{
            console.error(e);
            $scope.$emit("HideLoader",{});
        });
    });
    
    $scope.$on("copySelectedToPath", function(event, data){
        console.log(data);
        $scope.$emit("ShowLoader",{});
        APIService.copyFiles($ctrl.path, data.destination, $ctrl.selectedFiles, AuthService.getStorageToken())
        .then(data=>{
            console.log(data);
            if(data!='0;'){
                alert( "Cannot copy here. " + data.split(";")[1]);
                $scope.$emit("HideLoader",{});
            } else {
                $ctrl.getFiles();
            }
            $('#moveFilePopup').modal('hide');
            
        });
        //validate path is different, validate file not present in destination
    });

    $scope.$on("moveSelectedToPath", function(event, data){
        console.log(data);
        $scope.$emit("ShowLoader",{});
        APIService.moveFiles($ctrl.path, data.destination, $ctrl.selectedFiles, AuthService.getStorageToken())
        .then(data=>{
            console.log(data);
            if(data!='0;'){
                alert( "Cannot mover here. " + data.split(";")[1]);
                $scope.$emit("HideLoader",{});
            } else {
                $ctrl.getFiles();
            }
            $('#moveFilePopup').modal('hide');
        });
        //validate path is different, validate file not present in destination
    });

    $ctrl.clickToCopy = {
        modalHeader: "",
        value: "",
        doCopy: function(id){
            var element = document.getElementById(id);
            element.select();
            document.execCommand("copy");
        },
        showModal: function(){
            $('#clickToCopyModal').modal('hide');
        }
    }

    $ctrl.clickToCopy = function(id){
        var element = document.getElementById
        this.select()&&document.execCommand('copy');
    };

    (()=>{
        $ctrl.getFiles();
    })();

}]);