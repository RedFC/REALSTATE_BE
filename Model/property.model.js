const Joi = require("joi");

function PropertyModel(sequelize, Sequelize) {
    const Property = {
        paciNumber : {
        type: Sequelize.STRING
      },
      buildingNumber: {
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
      BlockNumber: {
        type: Sequelize.STRING
      },
      avenue: {
        type: Sequelize.STRING,
        defaultValue:null
      },
      harisNumber: {
        type: Sequelize.STRING
      },
      harisContactNumber:{
        type: Sequelize.STRING
      }
    };
  
    let property = sequelize.define("property", Property);
  
    return property;
  }
  
  function validate(User) {
    const schema = {
        paciNumber: Joi.number().integer().required(),
        buildingNumber: Joi.number().integer().required(),
        totalApartment: Joi.number().integer().required(),
        area: Joi.string().required(),
        streetName: Joi.string().required(),
        BlockNumber: Joi.string().required(),
        avenue: Joi.string(),
        harisNumber: Joi.number().integer().required(),
        harisContactNumber: Joi.number().integer().required()
    };
    return Joi.validate(User, schema);
  }

  exports.validate = validate;
  exports.PropertyModel = PropertyModel;
  