const router = require(`express`).Router(),
    authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
    controllers = require(`../../../controllers/api/accounts/profile`);


router.get(`/my-ads`,
    authMiddleware.ensureUserLoggedIn,
    controllers.myAds
);


module.exports = router;