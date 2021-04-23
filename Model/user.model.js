const Joi = require("joi");
const jwt = require("jsonwebtoken");

function UsersModel(sequelize, Sequelize) {
  const Userschema = {
    userName: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    emailVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
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
    Name: Joi.string().required(),
    phoneNumber: Joi.string()
  };
  return Joi.validate(User, schema);
}

exports.validateUser = validateUser;

function socialUser(User) {
  const schema = {
    email: Joi.string().required().min(10).max(255).email(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    userType: Joi.string().required(),
    userName: Joi.string().required(),
    dob: Joi.string().allow(''),
    phoneNumber: Joi.string().allow(''),
  };
  return Joi.validate(User, schema);
}

exports.socialUser = socialUser;