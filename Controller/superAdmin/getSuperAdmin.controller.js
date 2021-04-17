const db = require("../../Model");

const {
  validatePermissionGetResponse,
  validatePermissionGetResponseWithId,
} = require("../extras/ValidateWithPermissions");
const GetMerchant = require("../extras/GetMerchant");
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
      } else if (findroles.roleName == "Merchant") {
        validatePermissionGetResponse(
          permissions.canReadMerchant,
          req,
          res,
          false
        );
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
      let pag = await Users.findAll({
        offset:
          parseInt(req.query.page) * limit.limit
            ? parseInt(req.query.page) * limit.limit
            : 0,
        limit: req.query.page ? limit.limit : 1000000,
      });
      let countData = {
        page: parseInt(req.query.page),
        pages: Math.ceil(pag.length / limit.limit),
        totalRecords: pag.length
      }
      res.send({ data: pag, countData });
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
      if (memberRole.roleName == "Super Admin") {
        validatePermissionGetResponseWithId(
          permissions.canCreateAdmin, // permissions.canCreateAdmin,
          req,
          res,
          false
        );
      } else if (memberRole.roleName == "Merchant") {
        let permissionIs = null
        if (req.params.userId == req.user.id) {
          permissionIs = permissions.canReadOwnAccount
        } else {
          permissionIs = permissions.canReadMerchant
        }
        validatePermissionGetResponseWithId(
          permissionIs,
          req,
          res,
          false
        );
      } else if (memberRole.roleName == "Admin") {
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

  getAllSettings = async (req, res) => {
    try {
      let type = req.params.type;

      if (type && type == "howtouse") {
        let getAllHowToUse = await Howtouse.findAll({
          offset:
            parseInt(req.query.page) * limit.limit
              ? parseInt(req.query.page) * limit.limit
              : 0,
          limit: req.query.page ? limit.limit : 1000000,
          where: { isActive: true, isDeleted: false },
        });
        let countData = {
          page: parseInt(req.query.page),
          pages: Math.ceil(getAllHowToUse.length / limit.limit),
          totalRecords: getAllHowToUse.length
        }
        res.send({ getAllHowToUse, countData });
      } else if (type && type == "terms") {
        let getAllTerms = await Terms.findAll({
          offset:
            parseInt(req.query.page) * limit.limit
              ? parseInt(req.query.page) * limit.limit
              : 0,
          limit: req.query.page ? limit.limit : 1000000,
          where: { isActive: true }
        });
        let countData = {
          page: parseInt(req.query.page),
          pages: Math.ceil(getAllTerms.length / limit.limit),
          totalRecords: getAllTerms.length
        }
        res.status(200).send({getAllTerms, countData});
      } else if (type && type == "faqs") {
        let getAllFaqs = await FAQS.findAll({
          offset:
            parseInt(req.query.page) * limit.limit
              ? parseInt(req.query.page) * limit.limit
              : 0,
          limit: req.query.page ? limit.limit : 1000000,
          where: { isActive: true }
        });
        let countData = {
          page: parseInt(req.query.page),
          pages: Math.ceil(getAllFaqs.length / limit.limit),
          totalRecords: getAllFaqs.length
        }
        res.status(200).send({getAllFaqs, countData});
      } else if (type && type == "about") {
        let getAllAbout = await About.findAll({
          offset:
            parseInt(req.query.page) * limit.limit
              ? parseInt(req.query.page) * limit.limit
              : 0,
          limit: req.query.page ? limit.limit : 1000000,
          where: { isActive: true }
        });
        let countData = {
          page: parseInt(req.query.page),
          pages: Math.ceil(getAllAbout.length / limit.limit),
          totalRecords: getAllAbout.length
        }
        res.status(200).send({getAllAbout, countData});
      } else if (type && type == "radius") {
        let getAllActionRadius = await Actionradius.findAll({
          offset:
            parseInt(req.query.page) * limit.limit
              ? parseInt(req.query.page) * limit.limit
              : 0,
          limit: req.query.page ? limit.limit : 1000000,
          where: { isActive: true },
        });
        let countData = {
          page: parseInt(req.query.page),
          pages: Math.ceil(getAllActionRadius.length / limit.limit),
          totalRecords: getAllActionRadius.length
        }
        res.status(200).send({getAllActionRadius, countData});
      } else {
        res.status(400).send({ message: "Not Found" });
      }
    } catch (error) {
      res.status(500).send({ error: "Internal Server Error" });
    }
  };
}
module.exports = GetSuperAdmin;
