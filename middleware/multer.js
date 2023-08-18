let multer = require("multer");
let fs = require("fs");
let path = require("path");


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
    
    
// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       if (file.fieldname === "profileImg") {
        
//         cb(null, "./public/ProfileImage");
//       } else if (file.fieldname === "Aadharcard") {
//         fs.mkdir("./public/AadharCard", { recursive: true }, (err) => {
//           if (err) {
//             console.log("error occurred in creating new directory", err);
//             return;
//           }
//         });
  
//         cb(null, "./public/AadharCard");
//       }
//     },
//     filename: (req, file, cb) => {
//       if (file.fieldname === "profileImg") {
//         cb(
//           null,
//           Math.round(Math.random() * 1e9) + path.extname(file.originalname)
//         );
//       } else if (file.fieldname === "Aadharcard") {
//         cb(
//           null,
//           Math.round(Math.random() * 1e9) + path.extname(file.originalname)
//         );
//       }
//     },
//   });
//   const maxSize = 1 * 1024 * 1024;
  
//   var upload = multer({
//     storage: storage,
//     limits: { fileSize: maxSize },
//     fileFilter: (req, file, cb) => {
//       if (file.fieldname === "profileImg") {
//         if (
//           file.mimetype === "image/png" ||
//           file.mimetype === "image/jpg" ||
//           file.mimetype === "image/jpeg"
//         ) {
//           cb(null, true);
//         } else {
//           cb(null, false);
//           return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
//         }
//       } else if (file.fieldname === "Aadharcard") {
//         if (file.mimetype === "application/pdf") {
//           cb(null, true);
//         } else {
//           cb(null, false); // else fails
//           return cb(new Error("Only pdf allowed!"));
//         }
//       }
//     },
//   }).fields([
//     {
//       name: "profileImg",
//       maxCount: 10,
//     },
  //   {
  //     name: "Aadharcard",
  //     maxCount: 1,
  //   },
  // ]);

  module.exports = storage