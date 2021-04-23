const Joi = require("joi");
const db = require("./index");

function UsersBranchModel(sequelize, Sequelize) {
  const UsersBranch = {
    branchId: {
      type: Sequelize.INTEGER,
      references: {
        model: "branches",
        key: "id",
      },
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
  };

  let usersBranch = sequelize.define("usersbranch", UsersBranch);

  return usersBranch;
}

exports.UsersBranchModel = UsersBranchModel;

