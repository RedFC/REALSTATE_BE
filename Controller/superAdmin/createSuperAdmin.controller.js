const db = require("../../Model");
const _ = require("lodash");
const { validateUser: userAlias } = require("../../Model/user.model");
const { validatePermission } = require("../../Model/permissions.model");

const bcrypt = require("bcrypt");
const {
  UserPermission,
  superAdminPermission,
  adminPermission
} = require("../extras/Permission");
const valideRole = require("../extras/validateWithRole");
const fs = require("fs");
const { saveFile } = require("../extras/SaveFile");

const FindPermission = require("../extras/FindPermission");
const { getUser, updateUser } = require("../extras/BlockUser");
const FindMembersRole = require("../extras/FindMemberRole");
const UpdatePermission = require("../extras/UpdatePermission");
const {
  validatePermissionGetAccess,
} = require("../extras/ValidateWithPermissions");

const Permissions = db.permissions;
const Users = db.users;
const UsersDetail = db.usersdetail;
const Merchnatdetails = db.MerchantDetails;
const Shipping = db.ShippingModel;
const Op = db.Sequelize.Op;

class CreateSuperAdmin {
  registerMember = async (value, res) => {
    try {
      let memberRegister = Permissions.create(value);

      return res.status(200).send({ message: "Member Created Successfully!" });
    } catch (err) {
      return res.status(500).send({
        message: err.message || "Something Went Wrong",
      });
    }
  };

  createMember = async ({ req, res }) => {
    try {
      let rolevelidation = await valideRole(req.body.roleId, req.body, res);
      let roleMember = await FindMembersRole(req.body.roleId, res, req);
      let permissionDefine;

      if (roleMember.roleName == "User" && rolevelidation == "User") {
        permissionDefine = UserPermission;
      } else if (roleMember.roleName == "Admin") {
        permissionDefine = adminPermission;
      } else if (roleMember.roleName == "Super Admin") {
        permissionDefine = superAdminPermission;
      } else {
        res.status(500).send({ message: "Role Does not exist" });
      }

      let result = await Users.findOne({
        raw: true,
        where: {
          email: req.body.email,
        },
      });

      if (result && result.email) {
        res.status(401).send({ message: "Email Already Exist!." });
      } else {
        const user = _.pick(req.body, ["userName", "email", "password"]);
        let details = _.pick(req.body, [
          "firstName",
          "lastName",
          "address",
          "street",
          "country",
          "city",
          "state",
          "zipCode",
          "dob",
          "phoneNumber",
          "about",
          "gender",
          "bio",
        ]);
        user.emailVerified = 1;
        user.userType = "custom";
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        let userResponse = await Users.create(user);

        const newUserId = userResponse.dataValues.id;

        details.userId = userResponse.dataValues.id;
        permissionDefine.userId = userResponse.dataValues.id;
        permissionDefine.roleId = req.body.roleId;

        await UsersDetail.create(details);

        this.registerMember(permissionDefine, res);
      }
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Role.",
      });
    }
  };

  create = async (req, res) => {
    try {
      this.createMember({ req, res });
    } catch (err) {
      return res.status(500).send({
        message: err.message || "Something Went Wrong",
      });
    }
  };
}

module.exports = CreateSuperAdmin;
