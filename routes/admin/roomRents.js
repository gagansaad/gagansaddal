const router = require(`express`).Router(),
  
    controllers = require(`../../controllers/admin/ads/rentRooms`);




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
    console.log(req.file.mimetype)

    const fileType = req.file.mimetype.split('/')[1];
    if (fileType !== 'jpg' && fileType !== 'jpeg' && fileType !== 'png') {
        return res.status(200).json({ status: 400, error: 'Only JPEG or PNG images are allowed.' });
    }

    next();
}


router.get(`/fetchroomads`,
    
    controllers.fetchAll
);

router.get(`/view-roomrent-ad`,
    controllers.fetchOne
);
router.delete(`/delete-roomrent-ad`,
    controllers.fetchOneDelete
);

module.exports = router;