const Joi = require("joi");

function RentModel(sequelize, Sequelize) {
    const renttype = {
      typeName: {
        type: Sequelize.STRING
      },
      isDeleted : {
        type : Sequelize.BOOLEAN,
        defaultValue : 0
      }
    };
  
    let renttypes = sequelize.define("renttypes", renttype);
  
    return renttypes;
  }
  


  exports.RentModel = RentModel;
  