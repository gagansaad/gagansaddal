const express = require("express");

const { userList } = require("../../../controllers/accounts/admin/users");
const router = express.Router();

router.route("/list").get(userList);

module.exports = router;
