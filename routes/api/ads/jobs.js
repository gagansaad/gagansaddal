const router = require(`express`).Router(),
    authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
    controllers = require(`../../../controllers/api/posts/jobs`);

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");



// import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'djqwsb0hr', 
  api_key: '413855651964414', 
  api_secret: 'n3km-PA9egUoHXLnoCsmazdZ7Gc' 
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
    controllers.fetchAllAds
);
router.get(`/menu`,
    authMiddleware.ensureUserLoggedIn,
    controllers.fetchJobData
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
router.get(`/ad_details`,
    authMiddleware.ensureUserLoggedIn,
    controllers.fetchonead
);
module.exports = router;