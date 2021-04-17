const db = require("../../Model");

const limit = require("../extras/DataLimit");

const Permissions = db.permissions;
const Users = db.users;
const DetailedUser = db.usersdetail;
const Merchantdetail = db.MerchantDetails;
const Category = db.category;
const SubCategory = db.SubCategory;
const Likes = db.LikeModel;
const WishList = db.WishListModel;
const MerchantCategorys = db.merchantCategoryModel

module.exports = async function (req, res, userId, isBlocked, isRetur) {
  try {
    let members = await Users.findAll({
      offset:
        parseInt(req.query.page) * limit.limit
          ? parseInt(req.query.page) * limit.limit
          : 0,
          limit: req.query.page ? limit.limit : 1000000,
      raw: true,
      nest: true,
      where: {
        isDelete: false,
        isBlocked: isBlocked,
      },
      include: [
        userId
          ? {
              model: Permissions,
              where: {
                roleId: req.params.roleId,
                userId: userId,
              },
            }
          : {
              model: Permissions,
              where: {
                roleId: req.params.roleId,
              },
            },
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
          model: Merchantdetail,
        },
      ],
    });

    let countData = {
      page: parseInt(req.query.page),
      pages: Math.ceil(members.length / limit.limit),
      totalRecords: members.length
    }

    return res.status(200).send({ data: members, countData});
  } catch (err) {
    console.log("saririrri", err);
    return res
      .status(500)
      .send({ message: err.message || "Something went wrong!" });
  }
};
