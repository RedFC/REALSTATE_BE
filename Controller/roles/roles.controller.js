const db = require("../../Model");
const _ = require("lodash");
const { validate } = require("../../Model/role.model");

const Role = db.roles;
const Op = db.Sequelize.Op;

class Roles {

  create = async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.send(error.details[0].message);

    Role.findAll({
      where: {
        roleName: req.body.roleName,
      },
    })
      .then(async (result) => {
        if (result.length && result[0].dataValues.roleName) {
          res.status(401).send({ message: "Role Already Exist!." });
        } else {
          const role = _.pick(req.body, ["roleName"]);
          Role.create(role)
            .then((data) => {
              res.send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message || "Some error occurred while creating the Role.",
              });
            });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Role.",
        });
      });
  };

  getRoles = async (req, res, next) => {
    try {
        let result = await Role.findAll();
        if (result.length) {
            
            res.send({message: "Successfully Get Role!", data: result});
        } else {
            res
                .status(200)
                .send({message: "No Role Found!"});
        }
    } catch (error) {
        res
            .status(500)
            .send({
                message: error || "Something Went Wrong!"
            });
    }
};

}

module.exports = Roles;
