const router = require(`express`).Router(),
    authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
    controllers = require(`../../../controllers/api/posts/bizAndServices`);

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


const upload = multer({ storage: storage,limits: { fileSize: 1024 * 1024 * 5 } });

function validateImage(req, res, next) {


    const fileType = req.file.mimetype.split('/')[1];
    if (fileType !== 'jpg' && fileType !== 'jpeg' && fileType !== 'png') {
        return res.status(200).json({ status: 400, error: 'Only JPEG or PNG images are allowed.' });
    }

    next();
}


router.get(`/dynamics-data`,
    authMiddleware.ensureUserLoggedIn,
    controllers.getDnymicsData
);

router.post(`/create-service`, upload.fields([
    { name: 'photos', maxCount: 10 },
    { name: 'accreditation_document', maxCount: 5 }]),
    authMiddleware.ensureUserLoggedIn,
    controllers.validatebizAdsData,
    controllers.createbizAds
)


router.patch(`/edit/:bizId`,upload.fields([
    { name: 'photos', maxCount: 10 },
    { name: 'accreditation_document', maxCount: 5 }]),
    authMiddleware.ensureUserLoggedIn,
    // controllers.validatebizAdsData,
    // controllers.validateListerBasicinfo,
    controllers.editbizAds
);
// router.patch(`/edit-role/:buyAndSellId`,
//     authMiddleware.ensureUserLoggedIn,
//     controllers.editBuySellStatus
// );
router.get(`/fetchMyAds`,
    authMiddleware.ensureUserLoggedIn,
    controllers.fetchAll
);
router.get(`/ad_details`,
    authMiddleware.ensureUserLoggedIn,
    controllers.fetchonead
);
module.exports = router;