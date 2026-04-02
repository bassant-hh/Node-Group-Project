function responseObj(status,message,additionalData = {}) {
    return {
        status,message,...additionalData
    };
}
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
export {
    responseObj
    ,asyncHandler
};