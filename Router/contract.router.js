const rentContractController = require("../Controller/contractController/index");
const Token = require('../Middleware/token');
var router = require("express").Router();

let rent = new rentContractController();


router.post("/create", Token.isAuthenticated(), rent.create);
router.put("/update/:id", Token.isAuthenticated(), rent.updateContract);
router.get("/getall", Token.isAuthenticated(), rent.getAllContract);
router.get("/getOne/:id", Token.isAuthenticated(), rent.getspecificContract);
router.get("/delete/:id", Token.isAuthenticated(), rent.deleteContract);



module.exports = router;
