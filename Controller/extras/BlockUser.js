const db = require("../../Model");
const fs = require('fs');
const Permissions = db.permissions;
const BlockUser = db.blockUserModel;
const Users = db.users;
const Userdetails = db.usersdetail;

const getUser = async function (req, res, userId) {
  try {
    let usersPermission = await Users.findAll({
      raw: true,
      where: { id: userId },
    });

    return usersPermission[0];
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

module.exports.getUser = getUser;
module.exports.updateUser = updateUser;
