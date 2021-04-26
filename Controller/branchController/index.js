const db = require("../../Model");
const _ = require("lodash");
const { validate } = require("../../Model/branch.model");

const branch = db.BranchModel; 
const Op = db.Sequelize.Op;
const FindPermission = require("../extras/FindPermission");

class BranchController {

  create = async (req,res) => {

    try {

        let getPermission = await FindPermission(req.user.id);
        if(getPermission.canCreateBranches){
            let {error} = validate(req.body);
            if(error){
                res.status(500).send({message : error.details[0].message});
            }
            let schema = _.pick(req.body,['Name']);
            let createBranch = await branch.create(schema);
            if(createBranch){
                res.send({message : "Branch Created Succesfully",data : createBranch});
            }
        }else {
            res.status(401).send({
              message: "You don't have permissions!"
            });
          }

        
    } catch (error) {
        res.status(500).send({
            message: err.message || "Something Went Wrong",
          });
    }

  }

}

module.exports = BranchController;
