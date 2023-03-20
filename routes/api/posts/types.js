const router = require(`express`).Router(),
    authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
    controllers = require(`../../../controllers/api/posts/types`);

router.get(`/`,
    authMiddleware.ensureUserLoggedIn,
    controllers.fetchPostsTypes
);

router.post(`/`,
    authMiddleware.ensureUserLoggedIn,
    controllers.createPostsTypes
);

module.exports = router;