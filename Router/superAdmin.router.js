const db = require("../Model");
const SuperAdminController = require("../Controller/superAdmin/superAdmin.controller");
const getSuperAdminController = require("../Controller/superAdmin/getSuperAdmin.controller");

const Token = require("../Middleware/token");
const fileUpload = require("../Controller/extras/FileUpload");
const upload = fileUpload("image");
const router = require("express").Router();

let SuperAdmin = new SuperAdminController();
let getSuperAdmin = new getSuperAdminController();


router.post(
  "/create_user",
  Token.isAuthenticated(),
  upload.single("userImage"),
  SuperAdmin.create
);

router.get(
  "/getAllMembers",
  Token.isAuthenticated(),
  getSuperAdmin.getAllMembers
);

router.get(
  "/getSpecificMember/:roleId/:userId",
  Token.isAuthenticated(),
  getSuperAdmin.getSpecificMember
);

router.get(
  "/getmembers/:roleId",
  Token.isAuthenticated(),
  getSuperAdmin.getMembers
);


module.exports = router;
