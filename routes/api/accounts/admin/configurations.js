const router = require(`express`).Router(),
controllers = require(`../../../../controllers/api/accounts/admin/configurations`);

router.post('/',
    controllers.postconfigurations
);


module.exports = router;