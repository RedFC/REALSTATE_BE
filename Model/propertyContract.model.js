const Joi = require("joi");

function PropertyContractModel(sequelize, Sequelize) {
    const PropertyContract = {
      type : {
        type: Sequelize.STRING,
      },
      isDeleted : {
        type : Sequelize.BOOLEAN,
        defaultValue : 0
      }
      
    };
  
    let propertycontract = sequelize.define("propertycontract", PropertyContract);
  
    return propertycontract;
  }
  
  exports.PropertyContractModel = PropertyContractModel;
  