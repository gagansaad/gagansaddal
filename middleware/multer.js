let multer = require("multer");
let fs = require("fs");
let path = require("path");


const cloudinary = require("cloudinary").v2;
    const { CloudinaryStorage } = require("multer-storage-cloudinary");
    const multer = require("multer");
    
    
    
    // cloudinary.config({
    //     cloud_name: "dq7iwl5ql",
    //     api_key: "266878697381644",
    //     api_secret: "bmr-tEL9YY99dh9lTM4ig2F62K8",
    // });
    
    // import {v2 as cloudinary} from 'cloudinary';
          
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