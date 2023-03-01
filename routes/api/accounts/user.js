const router = require(`express`).Router(),
    controllers = require(`../../../controllers/api/accounts/user`);

router.post(`/signUpWithEmail`,
    controllers.signupWithEmail
);


router.post(`/login-with-email`,
    controllers.loginWithEmail
);



module.exports = router;