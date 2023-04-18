const router = require(`express`).Router(),

    controllers = require(`../../../controllers/api/posts/payment`);

    
    
    


router.get(`/fetchjobads`,
    
    controllers.fetchAll
);


module.exports = router;