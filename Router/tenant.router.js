const TenantController = require("../Controller/tenant/index");
const Token = require('../Middleware/token');
var router = require("express").Router();

let tenant = new TenantController();

router.post("/create", Token.isAuthenticated(), tenant.create);
router.get("/getAll", Token.isAuthenticated(), tenant.getAllTenant);



module.exports = router;