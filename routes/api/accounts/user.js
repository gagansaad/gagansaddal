const router = require(`express`).Router(),
    controllers = require(`../../../controllers/api/accounts/user`);

router.post(`/signUpWithEmail`,
    controllers.signupWithEmail
);



module.exports = router;