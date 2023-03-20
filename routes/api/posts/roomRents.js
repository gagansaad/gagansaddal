const router = require(`express`).Router(),
    authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
    controllers = require(`../../../controllers/api/posts/rentRooms`);

router.get(`/dynamics-data`,
    authMiddleware.ensureUserLoggedIn,
    controllers.fetchDynamicsData
);


module.exports = router;