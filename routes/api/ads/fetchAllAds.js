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
router.get(
  `/search`,
  authMiddleware.ensureUserLoggedInDummy,
  controllers.search
);
router.patch(
  `/remove-media`,
  authMiddleware.ensureUserLoggedInDummy,
  controllers.removemedia
);
router.patch(
  `/remove-accredation-file`,
  authMiddleware.ensureUserLoggedInDummy,
  controllers.remove_accredation_media
);
router.patch(
  `/edit-status`,
  authMiddleware.ensureUserLoggedIn,
  controllers.editStatus
);

router.get(
  `/recomended-ads`,
  authMiddleware.ensureUserLoggedIn,
  controllers.recomended_ads
);


module.exports = router;
