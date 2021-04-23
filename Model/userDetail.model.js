const Joi = require("joi");
const db = require("./index");

function UsersDetailModel(sequelize, Sequelize) {
  const UserDetailschema = {
    Name: {
      type: Sequelize.STRING,
    },
    phoneNumber: {
      type: Sequelize.STRING,
    },
    imagePath: {
      type: Sequelize.STRING
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
    Name: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    imagePath: Joi.string()
  };
  return Joi.validate(User, schema);
}

exports.validate = validate;