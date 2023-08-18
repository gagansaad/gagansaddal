const router = require(`express`).Router(),
controllers = require(`../../../../controllers/api/accounts/admin/configurations copy`);

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

const upload = multer({ storage: storage, });
router.post('/1',
    controllers.postconfigurations
);
router.post('/create_plan',
    controllers.posttypeconfigurations
);
router.post('/create_plan_addons',
    controllers.create_adons
);
router.post('/edit_plan_addons',upload.single("photos"),
    controllers.edit_adons
);
router.get('/type1',
    controllers.gettypeconfigurations
);
router.get('/fetch_plan',
    controllers.gettypeconfigurations
);


module.exports = router;