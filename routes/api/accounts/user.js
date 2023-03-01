const router = require(`express`).Router(),
    controllers = require(`../../../controllers/api/accounts/user`);

router.post(`/signUpWithEmail`,
    controllers.signupWithEmail
);


router.post(`/loginWithEmail`,
    controllers.loginWithEmail
);



module.exports = router;