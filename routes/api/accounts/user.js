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

// router.post(`/update-profile`, 
// upload.single("picture"),
//  controllers.update_profile
//  );

module.exports = router;