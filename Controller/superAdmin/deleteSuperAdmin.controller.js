const db = require("../../Model");
const _ = require("lodash");
const { validateUser: userAlias } = require("../../Model/user.model");
const { validatePermission } = require("../../Model/permissions.model");
const randomstring = require("crypto-random-string");

const bcrypt = require("bcrypt");
const {
  adminPermission,
  merchantPermission,
  superAdminPermission,
  userPermission,
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
const saletax = db.saleTaxModel;
const products = db.product;
const Op = db.Sequelize.Op;

class DeleteSuperAdmin {
  block_ = async ({ req, res }) => {
    try {
      let userResponse = await getUser(req, res, req.params.userId);

      let aa = await updateUser({
        req,
        res,
        userId: userResponse.id,
        status: userResponse.isBlocked ? false : true,
        key: "isBlocked",
      });

      return res.status(200).send({ message: "Successfully Blocked!" });
    } catch (err) {
      return res.status(500).send({
        message: err.message || "Something Went Wrong",
      });
    }
  };

  delete_ = async ({ req, res }) => {
    try {
      let userResponse = await getUser(req, res, req.params.userId);
      let aa = await updateUser({
        req,
        res,
        userId: userResponse.id,
        status: userResponse.isDelete ? false : true,
        key: "isDelete",
      });
      
      await products.update({isActive : 0},
        {where : {merchantId : req.params.userId} })

      return res.status(200).send({ message: "Successfully Deleted!" });
    } catch (err) {
      return res.status(500).send({
        message: err.message || "Something Went Wrong",
      });
    }
  };

  blockMember = async (req, res) => {
    try {
      let getPermission = await FindPermission(req.user.id);

      let roleMember = await FindMembersRole(req.params.roleId, res, req);

      if (roleMember.roleName == "Admin") {
        validatePermissionGetAccess({
          permissionIs: getPermission.canBlockAdmin,
          req,
          res,
          _func: this.block_({ req, res }),
        });
      } else if (roleMember.roleName == "Merchant") {
        validatePermissionGetAccess({
          permissionIs: getPermission.canBlockMerchant,
          req,
          res,
          _func: this.block_({ req, res }),
        });
      } else if (roleMember.roleName == "User") {
        validatePermissionGetAccess({
          permissionIs: getPermission.canBlockUser,
          req,
          res,
          _func: this.block_({ req, res }),
        });
      } else {
        res.status(401).send({ message: "You don't have permissions!" });
      }
    } catch (err) {
      res.status(500).send({
        message: err.message || "Something Went Wrong!",
      });
    }
  };

  deleteMember = async (req, res) => {
    try {
      let getPermission = await FindPermission(req.user.id);

      let roleMember = await FindMembersRole(req.params.roleId, res, req);

      if (roleMember.roleName == "Admin") {
        validatePermissionGetAccess({
          permissionIs: getPermission.canDeleteAdmin,
          req,
          res,
          _func: this.delete_({ req, res }),
        });
      } else if (roleMember.roleName == "Merchant") {
        validatePermissionGetAccess({
          permissionIs: getPermission.canDeleteMerchant,
          req,
          res,
          _func: this.delete_({ req, res }),
        });
      } else if (roleMember.roleName == "User") {
        validatePermissionGetAccess({
          permissionIs: getPermission.canDeleteUser,
          req,
          res,
          _func: this.delete_({ req, res }),
        });
      } else {
        res.status(401).send({ message: "You don't have permissions!" });
      }
    } catch (err) {
      res.status(500).send({
        message: err.message || "Something Went Wrong!",
      });
    }
  };
}

module.exports = DeleteSuperAdmin;
