
const router = require(`express`).Router(),
    authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
    controllers = require(`../../../controllers/api/posts/payment`);
    
    


router.post(`/create-payment-intent`,
authMiddleware.ensureUserLoggedIn,
    // controllers.validatepaymentData,
    controllers.create_payment_intent
);
router.get(`/billing-information`,
authMiddleware.ensureUserLoggedIn,
    // controllers.validatepaymentData,
    controllers.billingInfo
);
router.get(`/detach-card`,
authMiddleware.ensureUserLoggedIn,
    // controllers.validatepaymentData,
    controllers.detachcard
);
router.post(`/paymentstatus`,
// authMiddleware.ensureUserLoggedIn,
//     controllers.validatepaymentData,
    controllers.webhooks
);
module.exports = router;