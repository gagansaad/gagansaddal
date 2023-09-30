const router = require(`express`).Router(),
  authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
  controllers = require(`../../../controllers/api/posts/report`);

router.post(
  `/create-report`,
  authMiddleware.ensureUserLoggedIn,
  controllers.createreport
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
