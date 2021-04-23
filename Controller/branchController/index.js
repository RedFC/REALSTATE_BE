const db = require("../../Model");
const _ = require("lodash");
const { validate } = require("../../Model/apartments.model");

const apartment = db.ApartmentModel; 
const Op = db.Sequelize.Op;
const FindPermission = require("../extras/FindPermission");

class BranchController {

  

}

module.exports = BranchController;
