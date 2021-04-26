const Joi = require("joi");
const jwt = require("jsonwebtoken");

function UsersModel(sequelize, Sequelize) {
  const Userschema = {
    name : {
      type: Sequelize.STRING
    },
    userName: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    phoneNumber :{
      type: Sequelize.STRING
    },
    otpVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    isBlocked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    isDelete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  };

  const Users = sequelize.define("users", Userschema);
  return Users;
}

exports.UsersModel = UsersModel;

function validateUser(User) {
  const schema = {
    userName: Joi.string().required(),
    email: Joi.string().required().min(10).max(255).email(),
    password: Joi.string().required().min(6).max(255),
    name: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    roleId: Joi.number().required(),
  };
  return Joi.validate(User, schema);
}

exports.validateUser = validateUser;
