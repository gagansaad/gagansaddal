const Users = require('../../../model/accounts/users');

exports.userList = async(req,res, next) => {

    try {
        Users.find()
        .then(result => {
            res.status(200).json({
                data:result
            })
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



