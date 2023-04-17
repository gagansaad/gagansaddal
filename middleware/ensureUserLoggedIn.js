const mongoose = require(`mongoose`),
    User = mongoose.model("user"), 
     { verifyAndDecodeToken } = require(`../utils/generate`),
    jwt = require('jsonwebtoken');

exports.ensureUserLoggedIn = async (req, res, next) => {


    try {

        let token = null;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        console.log(`token`, token)

        if (!token) return res.json({
            status: 403,
            message: `InvalidToken` ,
            
        }) 
        else {

            const decodedPayload = verifyAndDecodeToken(token);
            console.log(`decodedPayload`,decodedPayload)
        

            if (!((decodedPayload && decodedPayload.userId))) {
                return res.json({
                    status: 403,
                    message: `unauthorized`,
                })
            } else {

                userId = decodedPayload.userId.trim();

                const dbQuery = {
                    // "userInfo.status": 1, //checking if user is active or not
                    _id: userId
                };

                const user = await User.findOne(dbQuery);

                if (!user) return res.status(401).json({
                    status: 404,
                    message: `User  not found`
                });
                req.userId = user._id;
            }

        }

        return next();
    } catch (err) {
        console.log(err)
        res.json({
            status: 403,
            message: `InvalidToken`,

        }) 
    }

}

function verifyqJWT(token) {
    jwt.verify(token, `AbCdEfGhIjKlMnOPYT`, function (err, decoded) {
        if (err) {
            return err;
        } else {
            return decoded.userId;
        }
    });
}
