const db = require("../../Model");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const valideRole = require("../extras/validateWithRole");
const FindPermission = require("../extras/FindPermission");
const FindMembersRole = require("../extras/FindMemberRole");
const config = require('config');

const {
  adminPermission,
  superAdminPermission,
  UserPermission,
  StaffPermission
} = require("../extras/Permission");
const {
  validatePermissionGetAccess,
} = require("../extras/ValidateWithPermissions");

const {validateUser} = require('../../Model/user.model');

const Permissions = db.permissions;
const Users = db.users;
const UserBranch = db.UsersBranchModel
const Branch = db.BranchModel;
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
      if(memberRegister){
        return res.status(200).send({
          message: "Account Created Successfully Credentials Has Been Emailed !"
        });
      }else{
        return res.status(500).send({
          message: "Something Went Wrong",
        });
      }
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
      if(rolevelidation.status == false) {return res.send(rolevelidation.data.details[0].message)}

      let roleMember = await FindMembersRole(req.body.roleId, res, req);
      let permissionDefine;
      if (roleMember.roleName == "User") {
        permissionDefine = UserPermission;
      }else if (roleMember.roleName == "Admin") {
        permissionDefine = adminPermission;
      } else if (roleMember.roleName == "Super Admin") {
        permissionDefine = superAdminPermission;
      }  else if (roleMember.roleName == "Staff") {
        permissionDefine = StaffPermission;
      }else {
        res.status(500).send({
          message: "Role Does not exist"
        });
      }

      let resultEmail = await Users.findOne({
        raw: true,
        where: {
              email:  req.body.email,
            }
      });

      let resultUserName = await Users.findOne({
        raw: true,
        where: {
          userName: req.body.userName,
            }
      });

      if (resultEmail) return res.status(401).send({
        message: "Email Already Exist!."
      });
      if (resultUserName) return res.status(401).send({
        message: "Username cannot be same!."
      });

      if(rolevelidation.type == "Staff"){
        let findBranches = await Branch.findAll();
        if(findBranches.length){
          let getOneBranch = await Branch.findOne({where : {id : req.body.branchId}});
          if(!getOneBranch){
            return res.send({message : "Required Branch Not Found"});
          }
        }else{
          return res.send({message : "Branches Not Found please create One To Add Staff"});
        }
        
      }
      const user = _.pick(req.body, ["name","userName","phoneNumber","email","password"]);
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      let createuser = await Users.create(user);
      if(createuser){
        if(rolevelidation.type == "Staff"){
          let AssignBranch = await UserBranch.create({branchId : req.body.branchId , userId : createuser.id});
        }
        permissionDefine.userId = createuser.id;
        permissionDefine.roleId = req.body.roleId;
        this.registerMember(permissionDefine, res);
      }
      // if (createuser) {
      //   sendVerificationEmail(
      //     req,
      //     res,
      //     createuser.dataValues.id,
      //     createuser.dataValues.email,
      //     createuser.dataValues.userName
      //   );
      // }
    } catch (err) {
      console.log(err);
      // return res.status(500).send({
      //   message: err.message || "Some error occurred while creating the Role.",
      // });
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
      } else if (roleMember.roleName == "Staff") {
        validatePermissionGetAccess({
          permissionIs: getPermission.canCreateStaff,
          req,
          res,
          _func: this.createMember({
            req,
            res
          }),
        });
      }else {
        res.status(500).send({
          message: "Role Not Found"
        });
      }
    } catch (err) {
      console.log(err);
      // return res.status(500).send({
      //   message: err.message || "Something Went Wrong",
      // });
    }
  };
}

module.exports = SuperAdmin;