function responseObj(status,message,additionalData = {}) {
    return {
        status,message,...additionalData
    };
}






export {
    responseObj
    
};