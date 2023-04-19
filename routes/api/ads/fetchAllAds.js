const router = require(`express`).Router(),
    authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
    controllers = require(`../../../controllers/api/posts/fectchAllAds`);

    
    
    


router.get(`/all-ads`,
authMiddleware.ensureUserLoggedIn,
    controllers.fetchAll
);



module.exports = router;