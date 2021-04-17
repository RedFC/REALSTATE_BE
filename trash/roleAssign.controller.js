const db = require("../Model");
const _ = require("lodash");
const { validate } = require("../Model/RoleAssign.model");

const Role = db.roleAssigned;
const Op = db.Sequelize.Op;

class RoleController {
  create = async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.send(error.details[0].message);

    Role.findAll({
      where: {
        userId: req.body.userId,
        roleId: req.body.roleId,
      },
    })
      .then(async (result) => {
        console.log("RoleController -> result", result);
        // if (result.length && result[0].dataValuesroleName) {
        //       res.status(401).send({ message: "Role Already Exist!." });

        // }
        //  else {
        //   const role = _.pick(req.body, ["roleName"]);
        //   Role.create(role)
        //     .then((data) => {
        //       res.send(data);
        //     })
        //     .catch((err) => {
        //       res.status(500).send({
        //         message:
        //           err.message || "Some error occurred while creating the Role.",
        //       });
        //     });
        // }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Role.",
        });
      });
  };





  
}

module.exports = RoleController;
