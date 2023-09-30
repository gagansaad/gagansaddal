const router = require(`express`).Router(),
  authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
  controllers = require(`../../../controllers/api/posts/tagline`);

router.get(
  `/tagline`,
  authMiddleware.ensureUserLoggedIn,
  controllers.fetchAllTags
);

module.exports = router;
