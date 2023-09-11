const router = require(`express`).Router(),
    controllers = require(`../../controllers/admin/configuration`);

router.post(`/create-configurations`,
    controllers.create_configuration
);




module.exports = router;