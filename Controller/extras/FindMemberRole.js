const db = require("../../Model");

const Roles = db.roles;

module.exports = async (roleId, res, req) => {
  try {
    let userRole = await Roles.findAll({
      where: { id: roleId },
      raw: true,
    });

    return userRole[0];
  } catch (err) {
    res.send({
      message: err.message || "Something Went Wrong While Getting Roles!",
    });
  }
};
