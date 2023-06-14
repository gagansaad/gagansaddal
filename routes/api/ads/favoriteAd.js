const router = require(`express`).Router(),
    authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
    controllers = require(`../../../controllers/api/posts/favoriteAds`);
   

    
    
    
router.post(`/create-favorite`,authMiddleware.ensureUserLoggedIn,controllers.createFavoriteAd)



router.get(`/all-favorite`,
authMiddleware.ensureUserLoggedIn,
    controllers.fetchFavoriteSchema
);
// router.get(`/all-ads`,
// // authMiddleware.ensureUserLoggedIn,
//     controllers.fetchAll
// );



module.exports = router;