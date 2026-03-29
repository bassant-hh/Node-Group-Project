function responseObj(status,message,additionalData = {}) {
    return {
        status,message,...additionalData
    };
}

module.export = {
    responseObj
};