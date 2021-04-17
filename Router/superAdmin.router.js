const db = require("../Model");
const SuperAdminController = require("../Controller/superAdmin/superAdmin.controller");

const Token = require("../Middleware/token");
const fileUpload = require("../Controller/extras/FileUpload");
const upload = fileUpload("image");
const router = require("express").Router();

let SuperAdmin = new SuperAdminController();

router.post(
  "/create_user",
  Token.isAuthenticated(),
  upload.single("userImage"),
  SuperAdmin.create
);


module.exports = router;
