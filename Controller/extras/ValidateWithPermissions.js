const FindMembersFromRole = require("./FilterMemberFromRole");
module.exports.validatePermissionGetResponse = async function (
  permission,
  req,
  res,
  getblock
) {
  if (permission) {
    await FindMembersFromRole(req, res, false, getblock);
  } else {
    return res.status(401).send({
      message: "You don't have permissions!",
    });
  }
};
module.exports.validatePermissionGetResponseWithId = async function (
  permission,
  req,
  res,
  getblock
) {
  if (permission) {
    await FindMembersFromRole(req, res, req.params.userId, getblock);
  } else {
    return res.status(401).send({
      message: "You don't have permissions!",
    });
  }
};
module.exports.validatePermissionGetAccess = async function ({
  permissionIs,
  req,
  res,
  _func,
}) {
  console.log(permissionIs);
  if (permissionIs) {
    return await _func;
  } else {
    return res.status(401).send({
      message: "You don't have permissions!",
    });
  }
};
