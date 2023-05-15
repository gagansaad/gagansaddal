const router = require(`express`).Router(),
    authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
    controllers = require(`../../../controllers/api/posts/payment`);

    
    
    


router.post(`/create-payment-intent`,
authMiddleware.ensureUserLoggedIn,
    controllers.validatepaymentData,
    controllers.create_payment_intent
);

router.post(`/payment-status`,express.raw({ type: 'application/json' }),
// authMiddleware.ensureUserLoggedIn,
//     controllers.validatepaymentData,
    controllers.stripe_webhooks
);
module.exports = router;