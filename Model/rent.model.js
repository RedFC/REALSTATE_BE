const Joi = require("joi");

function RentContractModel(sequelize, Sequelize) {
    const rentcontract = {
      propertyId: {
        type: Sequelize.INTEGER,
        references: {
          model: "properties",
          key: "id",
        },
      },
      appartmentId: {
        type: Sequelize.INTEGER,
        references: {
          model: "apartments",
          key: "id",
        },
      },
      tenantId: {
        type: Sequelize.INTEGER,
        references: {
          model: "tenants",
          key: "id",
        },
      },
      
    };
  
    let rentcontracts = sequelize.define("rentContract", rentcontract);
  
    return rentcontracts;
  }
  


  exports.RentContractModel = RentContractModel;
  