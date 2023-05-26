const router = require(`express`).Router(),
controllers = require(`../../../../controllers/api/accounts/admin/configurations copy`);

router.post('/1',
    controllers.postconfigurations
);
router.post('/create_plan',
    controllers.posttypeconfigurations
);
router.post('/create_plan_addons',
    controllers.create_adons
);
router.get('/type1',
    controllers.gettypeconfigurations
);
router.get('/fetch_plan',
    controllers.gettypeconfigurations
);


module.exports = router;