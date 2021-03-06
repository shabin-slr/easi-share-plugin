const APP_CONFIG = {
    useCORSProxy: true,
    proxyUrl: "https://gdps-url-validator.herokuapp.com/",
    rest: {
        apiBaseUrl: "https://demo2.easishare.com/api",
    },
    soap: {
        soapBaseUrl: "https://demo2.easishare.com/esws",
        deviceID: "1234",
        deviceType: "API",
        appVersion: "1.0"
    }
};

const REST_END_POINTS = {
    "LOGIN" : "/api/Auth/Token",
    "LIST_FILES" : "/api/FileRequest"
};

const SOAP_END_POINTS = {
    "SHARE": "/Share.asmx",
    "STORAGE": "/Storage.asmx",
    "UPLOAD_FILES" : "/UploadStorageFile.ashx",
    "DOWNLOAD_URL": "/DownloadStorageFile.ashx",
    "COPY_MOVE" : "/EasiShareMobile.asmx",
    "DEFAULT_SETTINGS": "/EasiShareWS.asmx"
};