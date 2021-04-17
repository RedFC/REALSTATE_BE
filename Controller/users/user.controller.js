const db = require("../../Model");
const _ = require("lodash");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const { validateUser, socialUser } = require("../../Model/user.model");
const Emailverification = require("../extras/Emailverification");
const sendVerificationEmail = require("../extras/EmailverificationSend");
const { userPermission } = require("../extras/Permission");
const cloudinary = require('../../config/cloudinary.config');
const randomstring = require("crypto-random-string");
const Op = db.Sequelize.Op;

const {
  getUserAccorStatus,
  getUserBySearchName,
} = require("../extras/GetUserAccorStatus");
const limit = require("../extras/DataLimit/index");

const Permissions = db.permissions;
const UsersDetail = db.usersdetail;
const Users = db.users;
const Block = db.blockUserModel;
const merchantDetails = db.MerchantDetails;
const Roles = db.roles;
const Friends = db.friends;
const Likes = db.LikeModel;
const WishList = db.WishListModel;
const ImageData = db.imageData;
class User {
  create = async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.send(error.details[0].message);
    Users.findOne({
      where: [
        {
          email: req.body.email,
        },
        {
          emailVerified: true,
        },
      ],
    })
      .then(async (result) => {
        if (result && result.dataValues.emailVerified) {
          res.status(200).send({ message: "User Already Exist!." });
        } else {
          let createdImg;
          const customUser = _.pick(req.body, [
            "userName",
            "email",
            "password",
            "userType",
          ]);
          let imgData = _.pick(req.body, [
            "userId",
            "imageId",
            "typeId",
            "imageUrl",
            "imageType"
          ]);
          const foundUserName = await Users.findOne({
            where: { userName: customUser.userName },
          });
          const salt = await bcrypt.genSalt(10);
          customUser.password = await bcrypt.hash(customUser.password, salt);
          customUser.isBlocked = false;
          customUser.isDelete = false;
          if (
            foundUserName &&
            foundUserName.dataValues.userName == customUser.userName
          )
            return res
              .status(400)
              .send({ message: "Username cannot be same." });

          if (customUser.userType == "custom") {
            Users.create(customUser)
              .then((data) => {
                Roles.findAll({
                  where: {
                    roleName: "User",
                  },
                })
                  .then(async (result) => {
                    let details = _.pick(req.body, [
                      "firstName",
                      "lastName",
                      "dob",
                      "phoneNumber"
                    ]);

                    const rndStr = randomstring({ length: 10 });
                    let dir = `uploads/users/${rndStr}/thumbnail/`;
                    if (req.file) {
                      const path = req.file.path;
                      cloudinary.uploads(path, dir)
                        .then(async uploadRslt => {
                          let userId = data.dataValues.id;
                          imgData.userId = userId;
                          imgData.imageId = uploadRslt.id;
                          imgData.typeId = userId
                          imgData.imageUrl = uploadRslt.url;
                          imgData.imageType = "User";

                          createdImg = await ImageData.create(imgData);
                          fs.unlinkSync(path);

                          let roleId = result[0].dataValues.id;
                          details.userId = userId;

                          let createdUserdetail = await UsersDetail.create(details);

                          let permissionobj = userPermission;

                          permissionobj.userId = userId;
                          permissionobj.roleId = roleId;

                          Permissions.create(permissionobj);
                          res.send({ message: "Created Successfully", data, createdImg });
                          sendVerificationEmail(
                            req,
                            res,
                            data.dataValues.id,
                            data.dataValues.email,
                            data.dataValues.userName
                          );
                        })
                        .catch(error => {
                          return res.status(500).send({ message: "An error occured while Creating the User." });
                        });
                    }
                    else {
                      let roleId = result[0].dataValues.id;
                      let userId = data.dataValues.id;
                      details.userId = data.dataValues.id;
                      details.imagePath = null;

                      let createdUserdetail = await UsersDetail.create(details);

                      let permissionobj = userPermission;

                      permissionobj.userId = userId;
                      permissionobj.roleId = roleId;

                      Permissions.create(permissionobj);
                      res.send({ message: "Created Successfully", data });
                      sendVerificationEmail(
                        req,
                        res,
                        data.dataValues.id,
                        data.dataValues.email,
                        data.dataValues.userName
                      );
                    }
                  })
                  .catch((err) => {
                    res.status(500).send({
                      message:
                        err.message ||
                        "Some error occurred while creating the User.",
                    });
                  });
              })
              .catch((err) => {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while creating the User.",
                });
              });
          } else {
            res.status(500).send({ message: "User Type is Invalid." });
          }
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User.",
        });
      });
  };

  social = async (req, res) => {
    const { error } = socialUser(req.body);
    if (error) return res.send(error.details[0].message);
    Users.findOne({
      where: [
        {
          email: req.body.email,
        },
      ],
    })
      .then(async (result) => {
        if (result && result.dataValues.email) {
          let Token = AuthTokenGen(result.dataValues.id);
          res
            .header("x-auth-token", Token)
            .status(200)
            .send({ message: "Successfully logged in", accessToken: Token });
        } else {
          const socialUser = _.pick(req.body, [
            "userName",
            "email",
            "userType",
          ]);
          socialUser.isBlocked = false;
          socialUser.isDelete = false;
          socialUser.emailVerified = false;
          let details = _.pick(req.body, [
            "firstName",
            "lastName",
            "dob",
            "phoneNumber",
          ]);
          if (
            socialUser.userType == "facebook" ||
            socialUser.userType == "gmail"
          ) {
            Users.create(socialUser)
              .then((data) => {
                roles
                  .findAll({
                    where: {
                      roleName: "User",
                    },
                  })
                  .then((result) => {
                    let roleId = result[0].dataValues.id;
                    let userId = data.dataValues.id;
                    details.imagePath = "";
                    details.userId = data.dataValues.id;
                    UsersDetail.create(details);

                    let permissionobj = userPermission;

                    permissionobj.userId = userId;
                    permissionobj.roleId = roleId;

                    permission.create(permissionobj);
                    res.send({ message: "Created Successfully", data });
                  })
                  .catch((err) => {
                    res.status(500).send({
                      message:
                        err.message ||
                        "Some error occurred while creating the User.",
                    });
                  });
              })
              .catch((err) => {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while creating the User.",
                });
              });
          } else {
            res.status(400).send({ message: "User Type Error." });
          }
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User.",
        });
      });
  };

  getAllCustomer = async (req, res) => {
    try {
      let userRole = await Roles.findOne({
        raw: true,
        where: {
          roleName: "User"
        },
      });

      let users = await Users.findAll({
        raw: true,
        nest: true,
        offset:
          parseInt(req.query.page) * limit.limit
            ? parseInt(req.query.page) * limit.limit
            : 0,
        limit: req.query.page ? limit.limit : 1000000,
        include: [
          {
            model: Permissions,
            where: {
              roleId: userRole.id
            },
          },
          {
            model: UsersDetail,
          },
          {
            model: Likes,
          },
          {
            model: WishList,
          },
        ],
      });

      let countData = {
        page: parseInt(req.query.page),
        pages: Math.ceil(users.length / limit.limit),
        totalRecords: users.length
      }
      return res.send({ data: users, countData });
    } catch (err) {
      return res
        .status(500)
        .send({ message: err.message || "Something Went Wrong!" });
    }
  };

  getCustomerById = async (req, res) => {
    try {
      const { userId } = req.params;
      const payloadId = req.user.id;

      let visitedUser = await UsersDetail.findOne({
        raw: true,
        where: {
          userId: userId,
        },
      });

      let _blockMember = await Block.findOne({
        raw: true,
        where: {
          [Op.or]: [
            {
              blockerId: {
                [Op.eq]: payloadId,
              },
            },
            {
              blockedId: {
                [Op.eq]: payloadId,
              },
            },
          ],
        },
      });

      if (visitedUser && _blockMember) {
        let info = await getUserAccorStatus({
          isFriend: false,
          isBlock: true,
          key: "id",
          userId,
          publicProfile: visitedUser.public_profile,
        });
        res.send({ data: info });
      }

      let _res = await Friends.findOne({
        raw: true,
        where: {
          isPending: false,
          isFriend: true,
          [Op.or]: [
            {
              senderId: {
                [Op.eq]: payloadId,
              },
            },
            {
              receiverId: {
                [Op.eq]: payloadId,
              },
            },
          ],
        },
      });

      if (_res) {
        let info = await getUserAccorStatus({
          isFriend: true,
          isBlock: false,
          key: "id",
          userId,
          publicProfile: visitedUser.public_profile,
        });

        res.send({ data: info });
      } else {
        console.log("elelellse");

        let _ = await getUserAccorStatus({
          isFriend: false,
          isBlock: false,
          key: "id",
          userId,
          publicProfile: visitedUser.public_profile,
        });
        res.send({ data: _ });
      }
    } catch (err) {
      return res
        .status(500)
        .send({ message: err.message || "Something Went Wrong!" });
    }
  };

  verifyEmail = (req, res) => {
    const token = req.params.token;
    Emailverification(token, res)
      .then((res) => res)
      .catch((err) => console.log(err));
    console.log(token);
  };

  getMerchantByCode = async (req, res) => {
    try {
      let merchantcode = req.params.code;

      let users = await Users.findAll({
        nest: true,
        raw: true,
        include: [
          {
            model: UsersDetail,
          },
          {
            model: merchantDetails,
            where: {
              merchantCode: merchantcode,
            },
          },
        ],
      });
      res.status(200).send({ data: users });
    } catch (error) {
      return res
        .status(500)
        .send({ message: err.message || "Something Went Wrong!" });
    }
  };

  searchByUserName = async (req, res) => {
    try {
      const { userName, userId } = req.body;
      const payloadId = req.user.id;

      let visitedUser = await Users.findOne({
        raw: true,
        nest: true,
        where: {
          userName: userName,
        },
        include: [
          {
            model: UsersDetail,
          },
        ],
      });

      let _blockMember = await Block.findOne({
        raw: true,
        where: {
          [Op.or]: [
            {
              blockerId: {
                [Op.eq]: payloadId,
              },
            },
            {
              blockedId: {
                [Op.eq]: payloadId,
              },
            },
          ],
        },
      });

      if (_blockMember) {
        let info = await getUserBySearchName({
          isFriend: false,
          isBlock: true,
          key: "userName",
          userId: userName,
          publicProfile: visitedUser.usersdetails.public_profile,
        });
        res.send({ data: info });
      }

      let _res = await Friends.findOne({
        raw: true,
        where: {
          isPending: false,
          isFriend: true,
          [Op.or]: [
            {
              senderId: {
                [Op.eq]: userId,
              },
            },
            {
              receiverId: {
                [Op.eq]: userId,
              },
            },
          ],
        },
      });

      if (_res) {
        let info = await getUserBySearchName({
          isFriend: true,
          isBlock: false,
          key: "userName",
          userId: userName,
          publicProfile: visitedUser.usersdetails.public_profile,
        });
        res.send({ data: info });
      } else {
        let _ = await getUserBySearchName({
          isFriend: false,
          isBlock: false,
          key: "userName",
          userId: userName,
          publicProfile: visitedUser.usersdetails.public_profile,
        });
        res.send({ data: _ });
      }
    } catch (err) {
      return res
        .status(500)
        .send({ message: err.message || "Something Went Wrong!" });
    }
  };
}

function AuthTokenGen(id) {
  const token = jwt.sign(
    {
      id: id,
    },
    config.get("jwtprivatekey")
  );
  return token;
}

module.exports = User;
