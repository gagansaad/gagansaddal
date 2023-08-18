const router = require(`express`).Router(),
    authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
    controllers = require(`../../../controllers/api/posts/bizAndServices`);

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
router.get(`/menu`,
    authMiddleware.ensureUserLoggedIn,
    controllers.fetchBizData
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
router.get(`/fetchAds`,
    authMiddleware.ensureUserLoggedIn,
    controllers.fetchAll
);
router.get(`/ad_details`,
    authMiddleware.ensureUserLoggedIn,
    controllers.fetchonead
);
module.exports = router;