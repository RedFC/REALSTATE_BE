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
      paymentType:{
        type: Sequelize.INTEGER,
        references: {
          model: "renttypes",
          key: "id",
        },
      },
      amount:{
        type: Sequelize.STRING
      },
      isDeleted : {
        type : Sequelize.BOOLEAN,
        defaultValue : 0
      }
      
    };
  
    let rentcontracts = sequelize.define("rentContract", rentcontract);
  
    return rentcontracts;
  }
  


  exports.RentContractModel = RentContractModel;
  