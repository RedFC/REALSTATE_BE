const VoucherController = require("../Controller/voucherController/index");
const Token = require('../Middleware/token');
var router = require("express").Router();

let Voucher = new VoucherController();

router.post("/create_recipt", Token.isAuthenticated(), Voucher.createRecepitVoucher);
router.post("/create_payment", Token.isAuthenticated(), Voucher.createPaymentVoucher);

router.get("/thesafe", Token.isAuthenticated(), Voucher.thesafe);




module.exports = router;