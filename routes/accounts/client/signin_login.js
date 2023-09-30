const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Users = require("../../../model/accounts/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/", (req, res, next) => {
  Users.find({ name: req.body.name })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          msg: "user not exit",
        });
      }
      bcrypt.compare(
        req.body.password,
        user[0].userInfo.password,
        (err, result) => {
          if (!result) {
            return res.status(401).json({
              msg: "password matching fail",
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                "userInfo.name": user[0].userInfo.name,
                "userInfo.email_address": user[0].userInfo.email,
                "userInfo.mobile_number.phone_number":
                  user[0].userInfo.mobile_number.phone_number,
              },
              "this is dummy text",
              {
                expiresIn: "24h",
              }
            );
            res.status(200).json({
              name: user[0].userInfo.name,
              email_address: user[0].userInfo.email_address,
              phone_number: user[0].userInfo.mobile_number.phone_number,
              token: token,
            });
          }
        }
      );
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
