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
        let mimetypes = req.files.map(mimetype => mimetype.mimetype)
        console.log("dhbbchdbchdbchdbchdhcdhcdh",req.fi);
    //    if(mimetypes){
            for (var i = 0; i <= mimetypes.length; i++) {
                if(!["image/jpg","image/jpeg","image/png"].includes(mimetypes[i])){
                    return res.status(400).json({ status: 400, error: 'Only JPEG or PNG images are allowed.' });
                } 
            }
            console.log("Fvdfdbdbdffb")
        // }
           
        
       
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