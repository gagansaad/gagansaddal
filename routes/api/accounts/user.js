const router = require(`express`).Router(),
    controllers = require(`../../../controllers/api/accounts/user`);

router.post(`/signup-with-email`,
    controllers.validate_signup_data,
    controllers.signup_with_email
);


router.post(`/login-with-email`, controllers.login_with_email);

router.get(`/country_code_lists`, controllers.country_code_lists);

router.post(`/verify-otp`, controllers.verifiy_otps);
router.post(`/forget-password`, controllers.forget_password);
router.post(`/verify-forget-password-otp`, controllers.verify_forget_password_otp);

router.post(`/update-password`, controllers.update_password);

module.exports = router;