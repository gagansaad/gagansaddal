
const mongoose = require("mongoose"),
    PostType = mongoose.model("PostType"),
    {
        successJSONResponse,
        failureJSONResponse
    } = require(`../../../handlers/jsonResponseHandlers`);


exports.fetchPostsTypes = async (req, res, next) => {

    try {
        PostType.find({})
            .then((foundPostType) => {
                return successJSONResponse(res, { postType: foundPostType });
            }).catch((err) => {
                return failureJSONResponse(res, { message: `something went wrong` })
            })

    } catch (err) {
        return failureJSONResponse(res, { message: `something went wrong` })
    }

}


exports.createPostsTypes = async (req, res, next) => {

    try {
        PostType.create(req.body)
            .then((newPostType) => {

                if (!newPostType){
                    return failureJSONResponse(res, { message: `something went wrong` })
                } else {
                    return successJSONResponse(res, { newPostType });
                }
                
            }).catch((err) => {
                return failureJSONResponse(res, { message: `something went wrong` })
            })

    } catch (err) {
        return failureJSONResponse(res, { message: `something went wrong` })
    }

}

