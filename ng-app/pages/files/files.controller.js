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
            $ctrl.selectedFiles = $ctrl.selectedFiles.filter(function(x){ return x.fileUrl != file.fileUrl});
        }
    };

    $ctrl.getFiles = function(){
        $scope.$emit("ShowLoader",{});
        APIService.getFileList($ctrl.path, AuthService.getStorageToken())
        .then(function(data){
            $ctrl.fileLoadStatus = "Loading ...";
            if(data.ErrorMessage){
                $location.path("/");
                $scope.$emit("HideLoader",{});
                $('.modal').modal('hide');
                return;
            }
            $ctrl.selectedFiles = [];
            $ctrl.files = data.Result || [];
            $ctrl.files.forEach(function(file){
                file.iconClass = getFileIcon(file);
            })
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
        $ctrl.selectedFiles.forEach(function(file){
            var deletePath = path + file.fileName;
            var deleteAction = file.isDirectory?APIService.deleteFolder:APIService.deleteFile;
            promises.push(deleteAction(deletePath, AuthService.getStorageToken()));
        });
        $q.all(promises)
        .then(function(data){
            $ctrl.getFiles();
        }).catch(function(e){
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
        .then(function(data){
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
        .then(function(data){
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
            .then(function(data){
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
        .then(function(data){
            console.log(data);
            if(data.SingleLinks && data.SingleLinks.length){
                // alert(data.SingleLinks[0]);
                // @TODO, show this in a click copy popup
                $ctrl.clickToCopy.modalHeader = "Share URL";
                $ctrl.clickToCopy.value = data.SingleLinks[0];
                $ctrl.clickToCopy.showModal();
            } else {
                alert("An error occurred, please try again later");
            }
            $scope.$emit("HideLoader",{});
        }).catch(function(e){
            console.error(e);
            $scope.$emit("HideLoader",{});
        });
    });
    
    $scope.$on("copySelectedToPath", function(event, data){
        console.log(data);
        $scope.$emit("ShowLoader",{});
        APIService.copyFiles($ctrl.path, data.destination, $ctrl.selectedFiles, AuthService.getStorageToken())
        .then(function(data){
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
        .then(function(data){
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
            element.focus();    
            element.select();
            document.execCommand("copy");
        },
        showModal: function(){
            $('#clickToCopyModal').modal('show');
        }
    }
/* 
    $ctrl.clickToCopy = function(id){
        var element = document.getElementById(id);
        this.select()&&document.execCommand('copy');
    }; */

    var getFileIcon = function(file){
        if(file.isDirectory){
            return "fa fa-folder-o fa-lg";
        }
        var type = null;
        let fileExtension = file.fileName.split('.').pop();
        switch (fileExtension){
            case "txt":
            case "log":
            type = "fa fa-file-text-o fa-lg";
            break;
            case "zip":
            case "7z":
            type = "fa fa-file-zip-o fa-lg";
            break;
            case "doc":
            case "dot":
            case "docx":
            case "dotx":
            type = "fa fa-file-word-o fa-lg";
            break;
            case "xls":
            case "xlt":
            case "xltx":
            case "xlsx":
            type = "fa fa-file-excel-o fa-lg";
            break;
            case "ppt":
            case "pptx":
            type = "fa fa-file-powerpoint-o fa-lg";
            break;
            case "pdf":
            type = "fa fa-file-pdf-o fa-lg";
            break;
            case "png":
            case "jpg":
            case "jpeg":
            case "gif":
            case "bmp":
            case "img":
            case "svg":
            case "psd":
            case "ico":
            type = "fa fa-file-image-o fa-lg";
            break;
            case "mp3":
            case "m3u":
            case "wav":
            case "flac":
            case "wma":
            case "aac":
            case "mid":
            type = "fa fa-file-audio-o fa-lg";
            break;
            case "mov":
            case "3gp":
            case "avi":
            case "flv":
            case "mpeg":
            case "mpg":
            case "mkv":
            case "wmv":
            case "mp4":
            type = "fa fa-file-video-o fa-lg";
            break;
            case "cs":
            case "js":
            case "css":
            case "java":
            type = "fa fa-file-code-o fa-lg";
            break;
            default:
            type = "fa fa-file-o fa-lg";
        }
        return type;
    };

    (function(){
        $ctrl.getFiles();
    })();

}]);