const router = require(`express`).Router(),
    authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
    controllers = require(`../../../controllers/api/posts/fectchAllMyAds`);
   

    
    
    


router.get(`/my-all-ads`,
authMiddleware.ensureUserLoggedIn,
    controllers.fetchAllMyAds
);
router.get(`/all-ads`,
// authMiddleware.ensureUserLoggedIn,
    controllers.fetchAll
);



module.exports = router;