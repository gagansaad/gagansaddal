const router = require(`express`).Router(),
  authMiddleware = require(`../../../middleware/ensureUserLoggedIn`),
  controllers = require(`../../../controllers/api/posts/chat_conversation`);

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// import {v2 as cloudinary} from 'cloudinary';
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

router.get(
  `/chat-details`,
  authMiddleware.ensureUserLoggedIn,
  controllers.ChatDetails
);
router.get(
  `/chat-list`,
  authMiddleware.ensureUserLoggedIn,
  controllers.ChatList
);
router.post(
  `/upload-file`,
  upload.single("photos"),
  authMiddleware.ensureUserLoggedIn,
  controllers.uploadfile
);
module.exports = router;
