const Joi = require("joi");

function PropertyModel(sequelize, Sequelize) {
    const Property = {
      branchId : {
        type: Sequelize.INTEGER,
        references: {
          model: "branches",
          key: "id",
        },
      },
      propertyNumber: {
        type: Sequelize.STRING
      },
      totalApartment : {
        type : Sequelize.INTEGER
      },
      area: {
          type: Sequelize.STRING
      },
      streetName: {
          type: Sequelize.STRING
      },
      image : {
        type: Sequelize.STRING
      },
      GuardContact : {
        type: Sequelize.STRING
      },
      propertyContract : {
        type: Sequelize.INTEGER,
        references: {
          model: "branches",
          key: "id",
        },
      }
    };
  
    let property = sequelize.define("property", Property);
  
    return property;
  }
  
  function validate(User) {
    const schema = {
        branchId: Joi.number().integer().required(),
        propertyNumber: Joi.number().integer().required(),
        totalApartment: Joi.number().integer().required(),
        area: Joi.string().required(),
        streetName: Joi.string().required(),
        GuardContact: Joi.string().required(),
    };
    return Joi.validate(User, schema);
  }

  exports.validate = validate;
  exports.PropertyModel = PropertyModel;
  