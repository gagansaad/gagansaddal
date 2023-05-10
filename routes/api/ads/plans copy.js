const router = require(`express`).Router(),
    authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
    controllers = require(`../../../controllers/api/posts/plans copy`);

router.get(`/`,
    // authMiddleware.ensureUserLoggedIn,
    controllers.fetchPlanForAds
);


module.exports = router;