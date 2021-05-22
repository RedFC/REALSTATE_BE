const TenantController = require("../Controller/tenant/index");
const Token = require('../Middleware/token');
var router = require("express").Router();

let tenant = new TenantController();

router.post("/create", Token.isAuthenticated(), tenant.create);
router.get("/getAll", Token.isAuthenticated(), tenant.getAllTenant);
router.put("/update/:id", Token.isAuthenticated(), tenant.update);
router.get("/getAll/:id", Token.isAuthenticated(), tenant.getOneTenant);
router.delete("/delete/:id", Token.isAuthenticated(), tenant.deleteTenant);



module.exports = router;
