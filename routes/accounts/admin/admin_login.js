const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Admin = require("../../../model/accounts/admin");
const Controller = require("../../../controllers/accounts/admin/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"),
  authMiddleware = require(`../../../middleware/ensureUserLoggedIn`);
router.post("/login", (req, res, next) => {
  Admin.find({ email_address: req.body.email_address })
    .exec()
    .then((admin) => {
      console.log(admin,"decdc");
      if (admin.length < 1) {
        return res.status(401).json({
          msg: "Admin Not Exist",
        });
      }

      bcrypt.compare(req.body.password, admin[0].password, (err, result) => {
        if (!result) {
          return res.status(401).json({
            msg: "password matching fail",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              userId: admin[0]._id,
            },
            "AbCdEfGhIjKlMnOPYT",
            {
              expiresIn: "24h",
            }
          );
          res.status(200).json({
            token: token,
            msg: "Admin Login Successfully!",
            // email_address:admin[0].email_address,
          });
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/forget-password", Controller.forget_password);
router.post("/reset-password", Controller.update_password);
router.get(
  "/fetch-profile",
  authMiddleware.ensureUserLoggedInAdmin,
  Controller.fetchProfileDetails
);
router.post(
  "/update-profile",
  authMiddleware.ensureUserLoggedInAdmin,
  Controller.update_profile
);

module.exports = router;
