const router = require(`express`).Router(),
    authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
    controllers = require(`../../../controllers/api/posts/fectchAllMyAds`);
   

    
    
    


router.get(`/my-ads-count`,
    authMiddleware.ensureUserLoggedIn,
    controllers.CountMyAd
);

router.get(`/adons-ads`,
authMiddleware.ensureUserLoggedInDummy,
    controllers.fetchAll
);

router.get(`/adons-ads1`,
authMiddleware.ensureUserLoggedInDummy,
    controllers.fetchAll1
);

module.exports = router;