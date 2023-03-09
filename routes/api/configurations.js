const router = require(`express`).Router(),
    controllers = require(`../../controllers/api/configurations`);

router.get(`/privacy-policy`,
    controllers.privacyPolicy
);



module.exports = router;