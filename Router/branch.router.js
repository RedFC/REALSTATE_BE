const BranchController = require("../Controller/branchController/index");
const Token = require('../Middleware/token');
var router = require("express").Router();

let branch = new BranchController();


router.post("/create", Token.isAuthenticated(), branch.create);
router.get("/getAll", Token.isAuthenticated(), branch.getAllBranch);
router.get("/delete/:id", Token.isAuthenticated(), branch.deleteBranch);



module.exports = router;
