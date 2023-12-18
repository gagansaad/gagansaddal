const router = require(`express`).Router(),
  controllers = require(`../../controllers/admin/ads/rentRooms`);

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

function validateImage(req, res, next) {
  const fileType = req.file.mimetype.split("/")[1];
  if (fileType !== "jpg" && fileType !== "jpeg" && fileType !== "png") {
    return res
      .status(200)
      .json({ status: 400, error: "Only JPEG or PNG images are allowed." });
  }

  next();
}

router.get(
  `/fetchroomads`,

  controllers.fetchAll
);
router.get('/room-rent-graph',controllers.fetchGraph);
router.get(`/view-roomrent-ad`, controllers.fetchOne);
router.delete(`/delete-roomrent-ad`, controllers.fetchOneDelete);

module.exports = router;
