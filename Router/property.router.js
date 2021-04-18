const PropertyController = require("../Controller/propertyController/index");
const ApartmentController = require("../Controller/apartmentController/index");
const Token = require('../Middleware/token');
var router = require("express").Router();

let Property = new PropertyController();
let Apartment = new ApartmentController();


router.post("/create", Token.isAuthenticated(), Property.create);


// Apartment Routing
router.post("/apartment/create", Token.isAuthenticated(), Apartment.create);


module.exports = router;
