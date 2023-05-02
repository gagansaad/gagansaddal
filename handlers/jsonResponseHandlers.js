exports.successJSONResponseWithPagination = async (res, responseModel, OnPage, perPage = 10,dbquery, message = `Record found successfully`, data, httpStatusCode = 200) => {
console.log(responseModel)
    if (res) {
        
        let responseModelWithLimit = await responseModel.find(dbquery).populate({ path: 'adsInfo.image', strictPopulate: false ,select:'url'}).sort({ createdAt: -1 }).skip((perPage * OnPage) - perPage).limit(perPage)
       console.log(responseModelWithLimit);
        const responseModelCount = await responseModel.count();
        const mainData = {
            message: message,
            perPage: perPage,
            totalPages: Math.ceil(responseModelCount / perPage),
            currentPage: OnPage,
            data: responseModelWithLimit
        }
        return res.status(httpStatusCode).json({
            status: httpStatusCode,
            ...mainData, ...data
        });
    }
}


exports.successJSONResponse = (res = null, data = null, httpStatusCode = null) => {

    if (res) {
        let httpStatusCodeToUse = 200;
        if (httpStatusCode && Number(httpStatusCode)) httpStatusCodeToUse = Number(httpStatusCode);

        return res.status(httpStatusCodeToUse).json({
            status: httpStatusCodeToUse,
            ...data
        });
    }
}

exports.failureJSONResponse = (res = null, data = null, httpStatusCode = null) => {
    if (res) {
        let httpStatusCodeToUse = 400;
        if (httpStatusCode && Number(httpStatusCode)) httpStatusCodeToUse = Number(httpStatusCode);

        return res.status(200).json({
            status: httpStatusCodeToUse,
            ...data
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