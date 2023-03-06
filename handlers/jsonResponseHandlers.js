exports.successJSONResponse = (res = null, data = null, httpStatusCode = null) => {

    if (res) {
        let httpStatusCodeToUse = 200;
        if (httpStatusCode && Number(httpStatusCode)) httpStatusCodeToUse = Number(httpStatusCode);

        return res.status(httpStatusCodeToUse).json({
            status: httpStatusCodeToUse,
            data
        });
    }
}

exports.failureJSONResponse = (res = null, data = null, httpStatusCode = null) => {
    if (res) {
        let httpStatusCodeToUse = 401;
        if (httpStatusCode && Number(httpStatusCode)) httpStatusCodeToUse = Number(httpStatusCode);

        return res.status(httpStatusCodeToUse).json({
            status: httpStatusCodeToUse,
            data
        });
    }
}

exports.errorJSONResponse = (res = null, message = `Error occured on server`, errorCode = null, data = null, httpStatusCode = 500) => {

    const objToSend = {
        status: `error`,
        message
    };

    if (errorCode) objToSend.code = errorCode;
    if (data) objToSend.data = data;

    return res.status(Number(httpStatusCode)).json(objToSend);
}