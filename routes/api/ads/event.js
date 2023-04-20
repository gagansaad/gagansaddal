const router = require(`express`).Router(),
    authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
    controllers = require(`../../../controllers/api/posts/event`);

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
    
    
    const upload = multer({ storage: storage, });
    
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

router.post(`/new-event`, upload.array('photos', 10),
    authMiddleware.ensureUserLoggedIn,
    controllers.validateEventAdsData,
    controllers.createEventAds
)


router.patch(`/edit/:eventId`,
    upload.array('photos', 12),
    authMiddleware.ensureUserLoggedIn,
    controllers.validateEventAdsData,
    controllers.validateListerBasicinfo,
    controllers.editEventAds
);
router.patch(`/edit-status/:eventId`,
    authMiddleware.ensureUserLoggedIn,
    controllers.editEventStatus
);
router.get(`/fetchMyAds`,
    authMiddleware.ensureUserLoggedIn,
    controllers.fetchAll
);
module.exports = router;