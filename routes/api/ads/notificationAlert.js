const router = require(`express`).Router(),
    authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
    controllers = require(`../../../controllers/api/posts/notificationAlert`);
   

    
    
    
router.post(`/create-alert`,authMiddleware.ensureUserLoggedIn,controllers.createAlert)
router.get(`/get-alerts`,authMiddleware.ensureUserLoggedIn,controllers.getAlerts)
router.get(`/fetch-notifications`,authMiddleware.ensureUserLoggedIn,controllers.getMyNotifications)
router.get(`/read-notifications`,authMiddleware.ensureUserLoggedIn,controllers.Notifications_status)



// router.get(`/all-favorite`,
// authMiddleware.ensureUserLoggedIn,
//     controllers.fetch
// );
// router.get(`/all-ads`,
// // authMiddleware.ensureUserLoggedIn,
//     controllers.fetchAll
// );



module.exports = router;