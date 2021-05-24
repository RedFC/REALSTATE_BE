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
            }
      ],
    });

    return res.status(200).send({ data: members});
    
  } catch (err) {
    console.log("saririrri", err);
    return res
      .status(500)
      .send({ message: err.message || "Something went wrong!" });
  }
};
