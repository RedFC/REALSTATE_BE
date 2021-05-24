const db = require("../../Model");

const {
  validatePermissionGetResponse,
  validatePermissionGetResponseWithId,
} = require("../extras/ValidateWithPermissions");
const FindPermission = require("../extras/FindPermission");

const findMembersRole = require("../extras/FindMemberRole");
const limit = require("../extras/DataLimit/index");

const Roles = db.roles;
const Permissions = db.permissions;
const Terms = db.termsCondition;
const About = db.aboutUs;
const Howtouse = db.HowToUse;
const FAQS = db.Faqs;
const Actionradius = db.ActionRadius;
const Users = db.users;
const UsersDetail = db.usersdetail;
const Op = db.Sequelize.Op;

class GetSuperAdmin {

  getMembers = async (req, res) => {
    let permissions = await FindPermission(req.user.id);
    let findroles = await findMembersRole(req.params.roleId, req, res);
    try {
      if (findroles.roleName == "User") {
        validatePermissionGetResponse(permissions.canReadUser, req, res, false);
      } else if (findroles.roleName == "Admin") {
        validatePermissionGetResponse(
          permissions.canReadAdmin,
          req,
          res,
          false
        );
      } else {
        res.status(401).send({ message: "Forbidden Access" });
      }
    } catch (err) {
      res.status(500).send({
        message: err.message || "Something Went Wrong!",
      });
    }
  };

  getAllMembers = async (req, res) => {
    try {
      let pag = await Users.findAll();
      res.send({ data: pag });
    } catch (err) {
      res.status(500).send({
        message: err.message || "Something Went Wrong!",
      });
    }
  };

  getBlockMembers = async (req, res) => {
    let permissions = await FindPermission(req.user.id);
    let findroles = await findMembersRole(req.params.roleId, req, res);
    try {
      if (findroles.roleName == "User") {
        validatePermissionGetResponse(permissions.canReadUser, req, res, true);
      } else if (findroles.roleName == "Merchant") {
        validatePermissionGetResponse(
          permissions.canReadMerchant,
          req,
          res,
          true
        );
      } else if (findroles.roleName == "Admin") {
        validatePermissionGetResponse(permissions.canReadAdmin, req, res, true);
      } else {
        res.status(401).send({ message: "Forbidden Access" });
      }
    } catch (err) {
      res.status(500).send({
        message: err.message || "Something Went Wrong!",
      });
    }
  };

  getSpecificMember = async (req, res) => {
    let permissions = await FindPermission(req.user.id);
    let memberRole = await findMembersRole(req.params.roleId, res, req);
    try {
      // if (memberRole.roleName == "Super Admin") {
      //   validatePermissionGetResponseWithId(
      //     permissions.canCreateAdmin, // permissions.canCreateAdmin,
      //     req,
      //     res,
      //     false
      //   );
      // } else
       if (memberRole.roleName == "Admin") {
        let permissionIs = null
        if (req.params.userId == req.user.id) {
          permissionIs = permissions.canReadOwnAccount
        } else {
          permissionIs = permissions.canReadAdmin
        }
        validatePermissionGetResponseWithId(
          permissionIs,
          req,
          res,
          false
        );
      } else if (memberRole.roleName == "User") {
        validatePermissionGetResponseWithId(
          true, //permissions.canReadUser,
          req,
          res,
          false
        );
      } else {
        res.status(401).send({ message: "Forbidden Access" });
      }
    } catch (err) {
      res.status(500).send({
        message: err.message || "Something Went Wrong!",
      });
    }
  };

}
module.exports = GetSuperAdmin;
