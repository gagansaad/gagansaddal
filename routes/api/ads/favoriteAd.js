const router = require(`express`).Router(),
  authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
  controllers = require(`../../../controllers/api/posts/favoriteAds`),
  controllers1 = require(`../../../controllers/api/posts/editMyAds`);

router.post(
  `/create-favorite`,
  authMiddleware.ensureUserLoggedIn,
  controllers.createFavoriteAd
);

router.post(
  `/edit-status`,
  authMiddleware.ensureUserLoggedIn,
  controllers1.setStatus
);
router.get(
  `/favorite-count`,
  authMiddleware.ensureUserLoggedIn,
  controllers.CountFavoriteAd
);

// router.get(`/all-favorite`,
// authMiddleware.ensureUserLoggedIn,
//     controllers.fetch
// );
// router.get(`/all-ads`,
// // authMiddleware.ensureUserLoggedIn,
//     controllers.fetchAll
// );

module.exports = router;
