const router = require(`express`).Router(),
controllers = require(`../../../../controllers/api/accounts/admin/configurations`);

router.post('/1',
    controllers.postconfigurations
);
router.post('/type1',
    controllers.posttypeconfigurations
);
router.get('/type1',
    controllers.gettypeconfigurations
);


module.exports = router;