const router = require(`express`).Router(),
  authMiddleware = require(`../../middleware/ensureUserLoggedIn`),
  controllers = require(`../../controllers/api/posts/types`);

router.get(`/`, controllers.fetchPostsTypes);

router.post(`/`, controllers.createPostsTypes);

module.exports = router;
