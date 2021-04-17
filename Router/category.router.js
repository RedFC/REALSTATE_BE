

const CategoryController = require("../Controller/category/category.controller");

const router = require("express").Router();

const Category = new CategoryController();
const Token = require("../Middleware/token");

router.post("/create", Token.isAuthenticated(), Category.create);
router.get("/getAll", Category.getCategoriesWithSubCategory);


module.exports = router;
