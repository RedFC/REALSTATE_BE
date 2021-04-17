const Joi = require("joi");

function permissions(sequelize, Sequelize) {
  const permission = sequelize.define("permissions", {
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    roleId: {
      type: Sequelize.INTEGER,
      references: {
        model: "roles",
        key: "id",
      },
    },
    canCreateAdmin: {
      type: Sequelize.BOOLEAN,
    },
    canReadAdmin: {
      type: Sequelize.BOOLEAN,
    },
    canUpdateAdmin: {
      type: Sequelize.BOOLEAN
    },
    canDeleteAdmin: {
      type: Sequelize.BOOLEAN
    },
    canBlockAdmin: {
      type: Sequelize.BOOLEAN
    },
    canUpdatePermissions: {
      type: Sequelize.BOOLEAN
    },
    canCreateUser: {
      type: Sequelize.BOOLEAN
    },
    canReadUser: {
      type: Sequelize.BOOLEAN
    },
    canUpdateUser: {
      type: Sequelize.BOOLEAN
    },
    canDeleteUser: {
      type: Sequelize.BOOLEAN
    },
    canBlockUser: {
      type: Sequelize.BOOLEAN
    },
  });

  return permission;
}
exports.permissions = permissions;

function validatePermission(User) {
  const schema = {
    userName: Joi.string().required().min(8).max(255),
    email: Joi.string().required().min(10).max(255).email(),
    password: Joi.string().required().min(6).max(255),
    roleId: Joi.number().required()
  };
  return Joi.validate(User, schema);
}
exports.validatePermission = validatePermission;