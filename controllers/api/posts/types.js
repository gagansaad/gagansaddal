
const mongoose = require("mongoose"),
    PostType = mongoose.model("PostType"),
    {
        successJSONResponse,
        failureJSONResponse
    } = require(`../../../handlers/jsonResponseHandlers`);


exports.fetchPostsTypes = async (req, res, next) => {
    try {
        PostType.find({
            is_active: true
        }).select(`name`)
            .then((foundPostType) => {
                return successJSONResponse(res, { message: `success`, postType: foundPostType });
            }).catch((err) => {
                return failureJSONResponse(res, { message: `Failed to fetch types`,error:err.message })
            })

    } catch (err) {
        return failureJSONResponse(res, { message: `something went wrong`,error:err.message })
    }
}


exports.createPostsTypes = async (req, res, next) => {

    try {       
        PostType.create(req.body)
            .then((newPostType) => {

                if (!newPostType){
                    return failureJSONResponse(res, { message: `Failed to create types` })
                } else {
                    return successJSONResponse(res, { newPostType });
                }
                
            }).catch((err) => {
                return failureJSONResponse(res, { message: `something went wrong`,Erorr:err.message })
            })

    } catch (err) {
        return failureJSONResponse(res, { message: `something went wrong`, Erorr:err.message})
    }

}

