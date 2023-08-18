const router = require(`express`).Router(),
    authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
    controllers = require(`../../../controllers/api/posts/event`);

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");



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
    upload.array('photos', 10),
    authMiddleware.ensureUserLoggedIn,
    controllers.validateEventAdsData,
    controllers.validateListerBasicinfo,
    controllers.editEventAds
);
router.get(`/menu`,
    authMiddleware.ensureUserLoggedIn,
    controllers.fetchEventData
);   
router.patch(`/edit-status/:eventId`,
    authMiddleware.ensureUserLoggedIn,
    controllers.editEventStatus
);
router.get(`/fetchAds`,
    authMiddleware.ensureUserLoggedIn,
    controllers.fetchAll
);
router.get(`/ad_details`,
    authMiddleware.ensureUserLoggedIn,
    controllers.fetchonead
);
module.exports = router;