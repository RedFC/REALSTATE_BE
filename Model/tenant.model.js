const Joi = require("joi");

function TenantModel(sequelize, Sequelize) {
    const tenant = {
      name: {
        type: Sequelize.STRING
      },
      number: {
        type: Sequelize.STRING
      },
      idNumber: {
        type: Sequelize.STRING
      },
      branchId : {
        type: Sequelize.INTEGER,
        references: {
          model: "branches",
          key: "id",
        },
      },
      nationality: {
        type: Sequelize.STRING
      },
      isDeleted : {
        type : Sequelize.BOOLEAN,
        defaultValue : 0
      }
    };
  
    let tenants = sequelize.define("tenants", tenant);
  
    return tenants ;
  }
  

  function validate(User) {
    const schema = {
      name: Joi.string().required(),
      number: Joi.string().required(),
      idNumber: Joi.string().required(),
      nationality: Joi.string().required(),
      branchId: Joi.string().required()
    };
    return Joi.validate(User, schema);
  }

  exports.validate = validate;

  exports.TenantModel = TenantModel;
  