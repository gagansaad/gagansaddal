const Users = require('../../../model/accounts/users'),
{
    successJSONResponse,
        failureJSONResponse
} = require(`../../../handlers/jsonResponseHandlers`);

exports.userList = async(req,res, next) => {

    try {
        Users.find()
        .then(result => {
            if (!result){
                return failureJSONResponse(res, {message: `something went wrong` })
            }
            return  successJSONResponse(res, { data: result })
        })
        .catch(err=>{
            res.status(500).json({
                error:err
            })
        })
        
    } catch (error) {
         res.status(error?.status || 400 ).send(error?.message || 'something went wrong!');
    }
    
};



