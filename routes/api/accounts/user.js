const router = require(`express`).Router(),
  authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
  controllers = require(`../../../controllers/api/accounts/user`);

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const CLOUD_NAME = process.env.CLOUD_NAME;
const CLOUD_API_KEY = process.env.CLOUD_API_KEY;
const CLOUD_SECRET = process.env.CLOUD_SECRET;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "DEV",
  },
});

const upload = multer({ storage: storage });

function validateImage(req, res, next) {
  const fileType = req.file.mimetype.split("/")[1];
  if (fileType !== "jpg" && fileType !== "jpeg" && fileType !== "png") {
    return res
      .status(200)
      .json({ status: 400, error: "Only JPEG or PNG images are allowed." });
  }

  next();
}

router.get(
  `/user-profile`,
  authMiddleware.ensureUserLoggedIn,
  controllers.fetchProfileDetails
);
router.get(
  `/profile-details`,
  // authMiddleware.ensureUserLoggedIn,
  controllers.fetchSellerUserDetails
);

router.post(
  `/signup-with-email`,
  controllers.validate_signup_data,
  controllers.signup_with_email
);

router.post(`/login-with-google`, controllers.login_signup_with_google);

router.post(`/login-with-facebook`, controllers.login_signup_with_facebook);

router.post(`/login-with-apple`, controllers.login_signup_with_apple);

router.post(`/login-with-email`, controllers.login_with_email);

router.get(`/country_code_lists`, controllers.country_code_lists);

router.post(
  `/verify-otp`,
  authMiddleware.ensureUserLoggedIn,
  controllers.verifiy_otps
);
router.post(
  `/verify-otp-for-email-mobile-change`,
  authMiddleware.ensureUserLoggedIn,
  controllers.verifiy_otp_for_email_phone_change
);
router.post(
  `/verify-otp-for-email-change`,
  authMiddleware.ensureUserLoggedIn,
  controllers.verifiy_otp_for_old_email
);

router.post(`/verify-email`, controllers.verifiy_otp_for_email_change);
router.post(`/forget-password`, controllers.forget_password);
router.post(
  `/verify-forget-password-otp`,
  controllers.verify_forget_password_otp
);

router.post(`/update-password`, controllers.update_password);

router.patch(
  `/update-profile`,
  authMiddleware.ensureUserLoggedIn,
  upload.single("picture"),
  controllers.update_profile
);

router.post(
  `/generate-otp-for-mobile-email-change`,
  authMiddleware.ensureUserLoggedIn,
  controllers.check_email_already_exists,
  controllers.generate_otp_for_change_email_mobile
);
router.post(
  `/generate-otp-for-email-change`,
  authMiddleware.ensureUserLoggedIn,
  // controllers.check_email_already_exists,
  controllers.generate_otp_for_change_email
);

router.post(
  `/generate_otp`,
  authMiddleware.ensureUserLoggedIn,
  controllers.generate_otp_for_signup_email_mobile
);

router.post(
  `/update_email_or_password`,
  authMiddleware.ensureUserLoggedIn,
  controllers.update_email_or_phone_number
);

router.post(`/logout`, authMiddleware.ensureUserLoggedIn, controllers.logout);
router.post(
  `/account-delete`,
  authMiddleware.ensureUserLoggedIn,
  controllers.account_delete
);
router.patch(
  `/change-password`,
  authMiddleware.ensureUserLoggedIn,
  controllers.change_password
);

module.exports = router;
