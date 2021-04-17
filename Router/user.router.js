const UserController = require("../Controller/users/user.controller");
const BlockUserController = require("../Controller/users/blockUser.controller");
const UserDetailController = require("../Controller/users/userDetail.controller");
let Token = require("../Middleware/token");
const fileUpload = require("../Controller/extras/FileUpload");
const upload = fileUpload("image");

let Userdetails = new UserDetailController();
const BlockUser = new BlockUserController();
let Users = new UserController();

var router = require("express").Router();

/*************** USER ***************/
router.post("/create", upload.single("userImage"), Users.create);

router.post("/social", Users.social);

router.get(
  "/getCustomerById/:userId",
  Token.isAuthenticated(),
  Users.getCustomerById
);

router.get("/getAllCustomer", Users.getAllCustomer);

router.post(
  "/searchByUserName",
  Token.isAuthenticated(),
  Users.searchByUserName
);

router.get("/verifyEmail/:token", Users.verifyEmail);

router.get("/getMerchantByCode/:code", Users.getMerchantByCode);

/*************** BLOCKUSER ***************/
router.post("/blockUser/create/:id", Token.isAuthenticated(), BlockUser.create);

router.get(
  "/blockUser/getBlockedUsers",
  Token.isAuthenticated(),
  BlockUser.getBlockedUsers
);

/*************** USER_DETAIL ***************/
router.post(
  "/user_detail/create",
  Token.isAuthenticated(),
  upload.single("userImage"),
  Userdetails.create
);

router.put(
  "/user_detail/update/:id",
  Token.isAuthenticated(),
  upload.single("userImage"),
  Userdetails.update
);

module.exports = router;
