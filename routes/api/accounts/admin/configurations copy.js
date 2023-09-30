const router = require(`express`).Router(),
  controllers = require(`../../../../controllers/api/accounts/admin/configurations copy`);

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const CLOUD_NAME = process.env.CLOUD_NAME;
const CLOUD_API_KEY = process.env.CLOUD_API_KEY;
const CLOUD_SECRET = process.env.CLOUD_SECRET;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "DEV",
  },
});

const upload = multer({ storage: storage });
router.post("/1", controllers.postconfigurations);
router.post("/create_plan", controllers.posttypeconfigurations);
router.post("/create_plan_addons", controllers.create_adons);
router.post(
  "/edit_plan_addons",
  upload.single("photos"),
  controllers.edit_adons
);
router.get("/type1", controllers.gettypeconfigurations);
router.get("/fetch_plan", controllers.gettypeconfigurations);

module.exports = router;
