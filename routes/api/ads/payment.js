const router = require(`express`).Router(),
    authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
    controllers = require(`../../../controllers/api/posts/payment`);
let express = require("express")
    
    
    


router.post(`/create-payment-intent`,
authMiddleware.ensureUserLoggedIn,
    controllers.validatepaymentData,
    controllers.create_payment_intent
);

router.post(`/paymentstatus`,express.raw({type: 'application/json'}),

    controllers.webhooks
);
module.exports = router;