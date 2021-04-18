const Joi = require("joi");

function ApartmentModel(sequelize, Sequelize) {
    const Apartment = {
        paciNumber : {
        type: Sequelize.STRING
      },
      floor: {
        type: Sequelize.STRING
      },
      flatNumber : {
        type : Sequelize.INTEGER
      },
      monthlyRent: {
          type: Sequelize.STRING
      },
      propertyId:{
        type : Sequelize.INTEGER,
        references: {
            model: "properties",
            key: 'id'
        }
      }
    };
  
    let apartment = sequelize.define("apartment", Apartment);
  
    return apartment;
  }
  

  function validate(User) {
    const schema = {
        paciNumber: Joi.number().integer().required(),
        floor: Joi.number().integer().required(),
        flatNumber: Joi.number().integer().required(),
        monthlyRent: Joi.number().integer().required(),
        propertyId: Joi.number().integer().required()
    };
    return Joi.validate(User, schema);
  }

  exports.validate = validate;


  exports.ApartmentModel = ApartmentModel;
  