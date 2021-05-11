const rentContractController = require("../Controller/contractController/index");
const Token = require('../Middleware/token');
var router = require("express").Router();

let rent = new rentContractController();


router.post("/create", Token.isAuthenticated(), rent.create);



module.exports = router;
