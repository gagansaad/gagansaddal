const mongoose = require(`mongoose`),
    jwt = require('jsonwebtoken'),
    { verifyAndDecodeToken } = require(`../utils/generate`),
    { isValidString } = require(`../utils/validators`),
    { sendFailureJSONResponse, sendSuccessJSONResponse, sendErrorJSONResponse } = require(`../handlers/jsonResponseHandlers`),
    User = mongoose.model(`user`),
    PermissionAccess = mongoose.model(`permissionAccess`),
    AlertMessage = require(`../config/alertMessage`);

exports.ensureUserLoggedIn = async (req, res, next) => {


    try {

        let token = null;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) return sendFailureJSONResponse(res, { message: AlertMessage.InvalidToken });
        else {

            const decodedPayload = verifyAndDecodeToken(token);

            if (!((decodedPayload && isValidString(decodedPayload.id)))) {
                return res.json({
                    
                })
            } else {

                userId = decodedPayload.id.trim();

                const dbQuery = {
                    // "userInfo.status": 1, //checking if user is active or not
                    _id: userId
                };

                const user = await User.findOne(dbQuery);

                if (!user) return res.json({
                    status: 404,
                    message: `User  not found`
                });
                req.userId = user._id;
            }

        }

        return next();
    } catch (err) {
        console
        return sendFailureJSONResponse(res, { message: AlertMessage.InvalidToken });
    }

}