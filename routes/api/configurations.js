const router = require(`express`).Router(),
    controllers = require(`../../controllers/api/configurations`);

router.get(`/privacy-policy`,
    controllers.privacyPolicy
);

router.get(`/term-conditions`,
    controllers.termAndConditions
);




module.exports = router;