const Joi = require("joi");

function BranchModel(sequelize, Sequelize) {
    const Branch = {
      Name: {
          type: Sequelize.STRING
      }
    };
  
    let branch = sequelize.define("branch", Branch);
  
    return branch;
  }
  

  function validate(request) {
    const schema = {
        Name: Joi.string().required()
    };
    return Joi.validate(request, schema);
  }

  exports.validate = validate;


  exports.BranchModel = BranchModel;
  