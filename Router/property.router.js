const PropertyController = require("../Controller/propertyController/index");
const ApartmentController = require("../Controller/apartmentController/index");
const Token = require('../Middleware/token');
var router = require("express").Router();

const fileUpload = require("../Controller/extras/FileUpload");
const upload = fileUpload("image");

let Property = new PropertyController();
let Apartment = new ApartmentController();


router.post("/create", Token.isAuthenticated(),upload.array('images'), Property.create);
router.get("/getAll", Token.isAuthenticated(), Property.getAllProperty);
<<<<<<< Updated upstream


// Apartment Routing
router.post("/apartment/create", Token.isAuthenticated(),upload.array('images'), Apartment.create);
router.get("/apartment/getALl", Token.isAuthenticated(), Apartment.getAllAppartments);
=======
router.put("/update/:id", Token.isAuthenticated(),upload.array('images'),Property.updateProperty);
router.get("/getOne/:id", Token.isAuthenticated(),Property.getProperty);


// Apartment Routing
router.post("/apartment/create", Token.isAuthenticated(),upload.array('images'),Apartment.create);
router.get("/apartment/getALl", Token.isAuthenticated(), Apartment.getAllAppartments);
router.put("/apartment/update/:id", Token.isAuthenticated(),upload.array('images'),Apartment.updateAppartment);
router.get("/apartment/getOne/:id", Token.isAuthenticated(),Apartment.getAppartment);
>>>>>>> Stashed changes


module.exports = router;
