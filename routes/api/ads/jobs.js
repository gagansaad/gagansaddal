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
    
    
    const upload = multer({ storage: storage, });
    
    function validateImage(req, res, next) {
        console.log("dhbbchdbchdbchdbchdhcdhcdh",req.files.map(({ mimetype }) => mimetype));
        let mimetypes = req.files.map(({ mimetype }) => mimetype)
        
       
            for (var i = 0; i <= mimetypes.length; i++) {
                if(mimetype !== 'image/jpg' || mimetype !== 'image/jpeg' || mimetype !== 'image/png'){
                     return res.status(400).json({ status: 400, error: 'Only JPEG or PNG images are allowed.' });}
            }
            
           
           
        
       
        next();
    }


router.get(`/dynamics-data`,
    authMiddleware.ensureUserLoggedIn,
    controllers.getDnymicsData
);

router.post(`/new-job`, upload.array('photos', 12),
    authMiddleware.ensureUserLoggedIn,
    validateImage,
    controllers.validateJobAdsData,
    controllers.createJobAds
)


router.patch(`/edit/:jobId`,
    upload.array('photos', 12),
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