const winston = require("winston");
const db = require("../../Model");
const Joi = require("joi");
const roles = db.roles;

module.exports = async function (roleId, reqBody, res) {
  try {
    let role = await roles.findOne({
      raw: true,
      where: {
        id: roleId,
      },
    });

    if (role.roleName == "Staff") {
      let { error } = validateStaff(reqBody);
      if (error) {
        return {status : false,data : error,type : "Staff"}
      } else {
        return {status : true,type : "Staff"}
      }
    }
    else if (role.roleName == "Admin") {
      return {status : true,type : "Admin"}
    } 
    else if (role.roleName == "User") {
      return {status : true,type : "User"}
    }
    else if (role.roleName == "Super Admin") {
      return {status : true,type : "Super Admin"}
    } 
  } catch (err) {
    winston.error(err);
  }

  function validateStaff(User) {
    const schema = {
      userName: Joi.string().required(),
      email: Joi.string().required().min(10).max(255).email(),
      password: Joi.string().required().min(6).max(255),
      name: Joi.string().required(),
      phoneNumber: Joi.string().required(),
      roleId: Joi.number().integer().required(),
      branchId : Joi.number().integer().required()
    };
    return Joi.validate(User, schema);
  }

};
