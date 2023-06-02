const router = require(`express`).Router(),
    authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
    controllers = require(`../../../controllers/api/posts/jobs`);

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

// fileFilter: (res, file, cb) => {
//     if (file.fieldname === "photos") {
//       if (
//         file.mimetype === "image/png" ||
//         file.mimetype === "image/jpg" ||
//         file.mimetype === "image/jpeg"
//       ) {
//         cb(null, true);
//       } else {
//         cb(null, false);
//         return res.status(200).json({ status: 400, error: 'Only JPEG or PNG images are allowed.' });
//       }
//     }
//   }, 

router.get(`/dynamics-data`,
    authMiddleware.ensureUserLoggedIn,
    controllers.getDnymicsData
);

router.post(`/new-job`, upload.array('photos', 10),
    authMiddleware.ensureUserLoggedIn,

    controllers.validateJobAdsData,
    controllers.createJobAds
)
router.get(`/fetchAds`,
    authMiddleware.ensureUserLoggedIn,
    controllers.fetchAll
);

router.patch(`/edit/:jobId`,
    upload.array('photos', 10),
    authMiddleware.ensureUserLoggedIn,
    controllers.validateJobAdsData,
    controllers.validateListerBasicinfo,
    controllers.editJobAds
);
router.patch(`/edit-role/:jobId`,
    authMiddleware.ensureUserLoggedIn,
    controllers.validateJobAdsData,
    controllers.editJobStatus
);
module.exports = router;