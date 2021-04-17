const Joi = require("joi");
const db = require("./index");

function UsersDetailModel(sequelize, Sequelize) {
  const UserDetailschema = {
    firstName: {
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    street: {
      type: Sequelize.STRING,
    },
    country: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
    state: {
      type: Sequelize.STRING,
    },
    zipCode: {
      type: Sequelize.STRING,
    },
    dob: {
      type: Sequelize.STRING,
    },
    phoneNumber: {
      type: Sequelize.STRING,
    },
    about: {
      type: Sequelize.STRING,
    },
    imagePath: {
      type: Sequelize.STRING
    },
    gender: {
      type: Sequelize.STRING,
    },
    bio: {
      type: Sequelize.TEXT,
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
  };

  let UsersDetail = sequelize.define("usersdetail", UserDetailschema);

  return UsersDetail;
}

exports.UsersDetailModel = UsersDetailModel;

function validate(User) {
  const schema = {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
    street: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    dob: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    imagePath: Joi.string(),
    gender: Joi.string().required(),
    public_profile: Joi.boolean().required(),
    bio: Joi.string().allow(''),
  };
  return Joi.validate(User, schema);
}

exports.validate = validate;