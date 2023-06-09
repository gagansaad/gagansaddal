const router = require(`express`).Router(),
    
    controllers = require(`../../controllers/admin/ads/subCategories`);

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


// router.get(`/fetchbuysellads`,
    
//     controllers.fetchAll
// );
router.post(`/create-sub-category-data`,controllers.createNewSubCategories)
router.get(`/fetch-sub-category-data`,controllers.fetchNewSubCategories)
router.post(`/delete-sub-category`,controllers.deleteNewSubCategories)
router.patch(`/update-sub-category`,controllers.updateSubCategories)
module.exports = router;