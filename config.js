const APP_CONFIG = {
    useCORSProxy: true,
    proxyUrl: "https://gdps-url-validator.herokuapp.com/",
    apiBaseUrl: "https://demo2.easishare.com/api",
    soapBaseUrl: "https://demo2.easishare.com/esws"
};

const REST_END_POINTS = {
    "LOGIN" : "/api/Auth/Token",
    "LIST_FILES" : "/api/FileRequest"
};

const SOAP_END_POINTS = {
    "SHARE_LOGIN": "",
    "SHARE_DEVICE_STATUS": "",
    "STORAGE_LOGIN": "",
    "STORAGE_GET_FILES": ""
};