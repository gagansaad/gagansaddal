const router = require(`express`).Router(),
    authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
    controllers = require(`../../../controllers/api/posts/jobs`);


router.get(`/dynamics`,controllers.getDnymicsData)
router.post('/new-jobs',controllers.createJob)


module.exports = router;