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
<<<<<<< Updated upstream
=======
      branchId : {
        type: Sequelize.INTEGER,
        references: {
          model: "branches",
          key: "id",
        },
      },
>>>>>>> Stashed changes
      nationality: {
        type: Sequelize.STRING
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
<<<<<<< Updated upstream
=======
      branchId: Joi.string().required()
>>>>>>> Stashed changes
    };
    return Joi.validate(User, schema);
  }

  exports.validate = validate;

  exports.TenantModel = TenantModel;
  