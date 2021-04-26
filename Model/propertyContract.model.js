const Joi = require("joi");

function PropertyContractModel(sequelize, Sequelize) {
    const PropertyContract = {
      type : {
        type: Sequelize.STRING,
      },
      
    };
  
    let propertycontract = sequelize.define("propertycontract", PropertyContract);
  
    return propertycontract;
  }
  
  exports.PropertyContractModel = PropertyContractModel;
  