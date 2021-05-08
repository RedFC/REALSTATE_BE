const Joi = require("joi");

function RentModel(sequelize, Sequelize) {
    const renttype = {
      typeName: {
        type: Sequelize.STRING
      }
    };
  
    let renttypes = sequelize.define("renttypes", renttype);
  
    return renttypes;
  }
  


  exports.RentModel = RentModel;
  