const router = require(`express`).Router(),
  authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
  controllers = require(`../../../controllers/api/posts/fectchAllMyAds`);

router.get(
  `/my-ads-count`,
  authMiddleware.ensureUserLoggedIn,
  controllers.CountMyAd
);

router.get(
  `/adons-ads`,
  authMiddleware.ensureUserLoggedInDummy,
  controllers.fetchAll
);

router.put(
  `/remove-media`,
  authMiddleware.ensureUserLoggedInDummy,
  controllers.removemedia
);
router.get(
  `/edit-status`,
  authMiddleware.ensureUserLoggedIn,
  controllers.editStatus
);

module.exports = router;
