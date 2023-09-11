const users = require('../../../model/accounts/users');
const Users = require('../../../model/accounts/users'),
{
    successJSONResponse,
        failureJSONResponse
} = require(`../../../handlers/jsonResponseHandlers`);

exports.userList = async(req,res, next) => {
        try {
          const {
            sortBy,
          } = req.query;

          const sortval = sortBy === "Oldest" ? { createdAt: 1 } : { createdAt: -1 };
          var perPage = parseInt(req.query.perpage) || 10;
          var page = parseInt(req.query.page) || 1;
          
          let records = await users.find({}, { "userInfo.password": 0 })
            .sort(sortval)
            .skip(perPage * page - perPage)
            .limit(perPage);
            const totalCount = await users.find();
            let responseModelCount = totalCount.length;
         
          if (records) {
            
            return successJSONResponse(res, {
              message: `success`,
              total: responseModelCount,
              perPage: perPage,
              totalPages: Math.ceil(responseModelCount / perPage),
              currentPage: page,
              records:records,
              status: 200,
            });
          } else {
            return failureJSONResponse(res, { message: `users not Available` });
          }
        } catch (err) {
          return failureJSONResponse(res, { message: `something went wrong` });
        }
      
};



