const router = require(`express`).Router(),
    controllers = require(`../../controllers/admin/configuration`);

router.post(`/privacy-policy`,
    controllers.createTermAndConditions
);




module.exports = router;