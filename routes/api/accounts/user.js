const router = require(`express`).Router(),
    authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
    controllers = require(`../../../controllers/api/accounts/user`);


const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");



cloudinary.config({
    cloud_name: "dq7iwl5ql",
    api_key: "266878697381644",
    api_secret: "bmr-tEL9YY99dh9lTM4ig2F62K8",
});



const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "DEV",
    },
});


const upload = multer({ storage: storage });

router.get(`/user-profile`,
    authMiddleware.ensureUserLoggedIn,
    controllers.fetchProfileDetails
);

router.post(`/signup-with-email`,
    controllers.validate_signup_data,
    controllers.signup_with_email
);


router.post(`/login-with-email`, controllers.login_with_email);

router.get(`/country_code_lists`, controllers.country_code_lists);

router.post(`/verify-otp`,
    authMiddleware.ensureUserLoggedIn,
    controllers.verifiy_otps
);

router.post(`/forget-password`, controllers.forget_password);
router.post(`/verify-forget-password-otp`, controllers.verify_forget_password_otp);

router.post(`/update-password`, controllers.update_password);

router.patch(`/update-profile`,
    authMiddleware.ensureUserLoggedIn,
    upload.single("picture"),
    controllers.update_profile
);


router.post(`/generate_otp`,
    authMiddleware.ensureUserLoggedIn,
    controllers.check_email_already_exists,
    controllers.generate_otp_for_change_email_mobile
);


router.post(`/update_email_or_password`,
    authMiddleware.ensureUserLoggedIn,
    controllers.check_email_already_exists,
    controllers.update_email_or_phone_number
);

module.exports = router;