const Joi = require("joi");

function ApartmentModel(sequelize, Sequelize) {
    const Apartment = {
      propertyNumber: {
        type: Sequelize.STRING
      },
      floor: {
        type: Sequelize.STRING
      },
      flatNumber : {
        type : Sequelize.INTEGER
      },
      rentTypeId: {
        type : Sequelize.INTEGER,
        references: {
            model: "renttypes",
            key: 'id'
        }
      },
      numberOfRooms :{
        type : Sequelize.INTEGER
      },
      numberOfBathrooms :{
        type : Sequelize.INTEGER
      },
      numberOfHalls :{
        type : Sequelize.INTEGER
      },
      numberOfKitchens :{
        type : Sequelize.INTEGER
      },
      rentAmount: {
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
        propertyNumber: Joi.number().integer().required(),
        floor: Joi.string().required(),
        flatNumber: Joi.string().required(),
        rentTypeId: Joi.number().integer().required(),
        numberOfRooms : Joi.number().integer().required(),
        numberOfBathrooms: Joi.number().integer().required(),
        numberOfHalls : Joi.number().integer().required(),
        numberOfKitchens : Joi.number().integer().required(),
        rentAmount : Joi.number().integer().required(),
        propertyId : Joi.number().integer().required()
    };
    return Joi.validate(User, schema);
  }

  exports.validate = validate;


  exports.ApartmentModel = ApartmentModel;
  