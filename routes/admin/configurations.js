const router = require(`express`).Router(),
    controllers = require(`../../controllers/admin/configuration`);

router.post(`/create-configurations`,
    controllers.create_configuration
);

router.post(`/get_configuation`,
    controllers.get_configuation
);




module.exports = router;