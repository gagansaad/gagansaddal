const router = require(`express`).Router(),

    controllers = require(`../../controllers/admin/ads/jobs`);

    const cloudinary = require("cloudinary").v2;
    const { CloudinaryStorage } = require("multer-storage-cloudinary");
    const multer = require("multer");
    
    
    
    cloudinary.config({
        cloud_name: "djqwsb0hr",
        api_key: "413855651964414",
        api_secret: "n3km-PA9egUoHXLnoCsmazdZ7Gc",
    });
    
    
    
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: "DEV",
        },
    
    });

    const upload = multer({ storage: storage});

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


router.get(`/fetchjobads`,
    
    controllers.fetchAll
);

router.get(`/view-job-ad`,
    controllers.fetchOne
);
router.delete(`/delete-job-ad`,
    controllers.fetchOneDelete
);
module.exports = router;