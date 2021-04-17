const db = require("../../Model");
const _ = require("lodash");
const {
  validateUser: userAlias
} = require("../../Model/user.model");
const {
  validatePermission
} = require("../../Model/permissions.model");
const randomstring = require("crypto-random-string");

const bcrypt = require("bcrypt");
const {
  adminPermission,
  superAdminPermission,
  UserPermission
} = require("../extras/Permission");
const valideRole = require("../extras/validateWithRole");
const fs = require("fs");
const {
  saveFile
} = require("../extras/SaveFile");

const FindPermission = require("../extras/FindPermission");
const {
  getUser,
  updateUser
} = require("../extras/BlockUser");
const FindMembersRole = require("../extras/FindMemberRole");
const UpdatePermission = require("../extras/UpdatePermission");
const {
  validatePermissionGetAccess,
} = require("../extras/ValidateWithPermissions");

const cloudinary = require('../../config/cloudinary.config');

const Emailverification = require("../extras/Emailverification");
const sendVerificationEmail = require("../extras/EmailverificationSend");
const config = require('config');

const Permissions = db.permissions;
const Users = db.users;
const UsersDetail = db.usersdetail;
const ImageData = db.imageData;
const Op = db.Sequelize.Op;

class SuperAdmin {



  filterMemberFromRole = async (userId) => {
    try {
      let members = await Users.findAll({
        limit: 1,
        raw: true,
        nest: true,
        where: {
          isDelete: false,
          isBlocked: false,
        },
        include: [{
          model: Permissions,
          where: {
            userId: userId,
          },
        }, ],
      });
      return members[0];
    } catch (err) {
      return err;
    }
  };


  registerMember = async (value, res) => {
    try {
      let memberRegister = await Permissions.create(value);
      return res.status(200).send({
        message: "Account Created Successfully Credentials Has Been Emailed !"
      });
    } catch (err) {
      return res.status(500).send({
        message: err.message || "Something Went Wrong",
      });
    }
  };

  createMember = async ({
    req,
    res
  }) => {
    try {
      let rolevelidation = await valideRole(req.body.roleId, req.body, res);
      let roleMember = await FindMembersRole(req.body.roleId, res, req);
      let permissionDefine;
      if (roleMember.roleName == "User" && rolevelidation == "User") {
        permissionDefine = UserPermission;
      }else if (roleMember.roleName == "Admin") {
        permissionDefine = adminPermission;
      } else if (roleMember.roleName == "Super Admin") {
        permissionDefine = superAdminPermission;
      } else {
        res.status(500).send({
          message: "Role Does not exist"
        });
      }

      let result = await Users.findOne({
        raw: true,
        where: {
          [Op.or]: [{
              email: {
                [Op.eq]: req.body.email,
              },
            },
            {
              userName: {
                [Op.eq]: req.body.userName,
              },
            },
          ]
        }
      });

      if (result && result.email == req.body.email) return res.status(401).send({
        message: "Email Already Exist!."
      });
      if (result && result.userName == req.body.userName) return res.status(401).send({
        message: "Username cannot be same!."
      });
      const user = _.pick(req.body, ["userName", "email"]);
      user.password = config.get('Default_password.password')
      user.emailVerified = 1;
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      let createuser = await Users.create(user);
      // if (createuser) {
      //   sendVerificationEmail(
      //     req,
      //     res,
      //     createuser.dataValues.id,
      //     createuser.dataValues.email,
      //     createuser.dataValues.userName
      //   );
      // }
      permissionDefine.userId = createuser.dataValues.id;
      permissionDefine.roleId = req.body.roleId;
      this.registerMember(permissionDefine, res);

    } catch (err) {
      return res.status(500).send({
        message: err.message || "Some error occurred while creating the Role.",
      });
    }
  };

  create = async (req, res) => {
    try {
      let getPermission = await FindPermission(req.user.id);
      let roleMember = await FindMembersRole(req.body.roleId, res, req);
      if (roleMember.roleName == "Admin") {
        validatePermissionGetAccess({
          permissionIs: getPermission.canCreateAdmin,
          req,
          res,
          _func: this.createMember({
            req,
            res
          }),
        });
      } else if (roleMember.roleName == "User") {
        validatePermissionGetAccess({
          permissionIs: getPermission.canCreateUser,
          req,
          res,
          _func: this.createMember({
            req,
            res
          }),
        });
      } else if (roleMember.roleName == "Super Admin") {
        validatePermissionGetAccess({
          permissionIs: getPermission.canCreateAdmin,
          req,
          res,
          _func: this.createMember({
            req,
            res
          }),
        });
      } else {
        res.status(500).send({
          message: "Role Not Found"
        });
      }
    } catch (err) {
      return res.status(500).send({
        message: err.message || "Something Went Wrong",
      });
    }
  };
}

module.exports = SuperAdmin;