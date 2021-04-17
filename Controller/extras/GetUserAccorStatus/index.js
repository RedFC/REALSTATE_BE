const { rest } = require("lodash");
const db = require("../../../Model");

const Permissions = db.permissions;
const BlockUser = db.blockUserModel;
const Users = db.users;
const DetailedUser = db.usersdetail;
const Likes = db.LikeModel;
const WishList = db.WishListModel;
const Friends = db.friends;
const Op = db.Sequelize.Op;

const getUserAccorStatus = async function ({
  isFriend,
  isBlock,
  key,
  userId,
  publicProfile,
}) {
  try {
    if (isBlock) {
      let userInfo = await Users.findOne({
        raw: true,
        nest: true,
        where: { isDelete: false, isBlocked: false, [key]: [userId] },
        attributes: ["userName", "id", "email", "userType"],
      });

      return userInfo;
    }

    let qry = isFriend || publicProfile;

    let userInfo = await Users.findOne({
      nest: true,
      where: { isDelete: false, isBlocked: false, [key]: [userId] },

      include: qry
        ? [
            {
              model: DetailedUser,
            },
            {
              model: Likes,
            },

            {
              model: WishList,
            },
            {
              model: Friends,
              as: "receiver",
            },
            {
              model: Friends,
              as: "sender",
            },
          ]
        : {
            model: DetailedUser,
            attributes: ["imagePath", "firstName", "public_profile"],
          },
    });

    if (qry) {
      let mergeArray = [
        ...userInfo.dataValues.sender,
        ...userInfo.dataValues.receiver,
      ];

      delete userInfo.dataValues.sender;
      delete userInfo.dataValues.receiver;

      userInfo.dataValues.friends = mergeArray;
    }

    return userInfo;
  } catch (err) {
    return err;
  }
};

const getUserBySearchName = async function ({
  isFriend,
  isBlock,
  key,
  userId,
  publicProfile,
}) {
  try {
    if (isBlock) {
      let userInfo = await Users.findOne({
        raw: true,
        nest: true,
        where: { isDelete: false, isBlocked: false, [key]: [userId] },
        attributes: ["userName", "id", "email", "userType"],
      });

      return userInfo;
    }

    let userInfo = await Users.findOne({
      raw: true,
      nest: true,
      where: { isDelete: false, isBlocked: false, [key]: [userId] },

      include: [
        (!isFriend && publicProfile) || !publicProfile
          ? {
              model: DetailedUser,
              attributes: ["imagePath", "firstName", "public_profile"],
            }
          : isFriend
          ? {
              model: DetailedUser,
              attributes: [
                "imagePath",
                "firstName",
                "public_profile",
                "lastName",
              ],
            }
          : null,
      ],
    });

    return userInfo;
  } catch (err) {
    return err;
  }
};

const updateUser = async function ({ req, res, userId, status, key }) {
  try {
    let usersPermission = await Users.update(
      { [key]: status },
      { where: { id: userId } }
    );

    return res.status(200).send({ message: "Successfully Done!" });
  } catch (err) {
    return res
      .status(500)
      .send({ message: err.message || "Something Went Wrong!" });
  }
};

module.exports.getUserAccorStatus = getUserAccorStatus;
module.exports.updateUser = updateUser;
module.exports.getUserBySearchName = getUserBySearchName;
