const rentContractController = require("../Controller/contractController/index");
const Token = require('../Middleware/token');
var router = require("express").Router();

let rentContract = new rentContractController();

router.post("/createContract", Token.isAuthenticated(), rentContract.create);
router.delete("/delete:/id", Token.isAuthenticated(), rentContract.deleteContract);


module.exports = router;
