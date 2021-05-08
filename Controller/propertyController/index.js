const db = require("../../Model");
const _ = require("lodash");
const { validate } = require("../../Model/property.model");
const FindPermission = require("../extras/FindPermission");


const property = db.PropertyModel; 
const branch = db.BranchModel; 
const Op = db.Sequelize.Op;

class PropertyController {

  create = async (req, res) => {
    
    try {
        let getPermission = await FindPermission(req.user.id);
        if(getPermission.canCreateProperty){
        let {error} = validate(req.body);
        if (error) return res.send(error.details[0].message);

        let schema = _.pick(req.body, [
            "branchId",
            "propertyNumber",
            "totalApartment",
            "area",
            "streetName",
            "GuardContact"
          ]);

          let findBranches = await branch.findAll();
          if(findBranches.length){
            let getOneBranch = await branch.findOne({where : {id : req.body.branchId}});
            if(!getOneBranch){
              return res.send({message : "Required Branch Not Found"});
            }
          }else{
            return res.send({message : "Branches Not Found please create One"});
          }

          let createProperty = await property.create(schema);
          if(createProperty){
              return res.send({message : "succesfully Createad",data : createProperty})
          }
        }
        else{
            res.status(403).send({message : "You Don't Have Permission"})
        }

        } catch (error) {
            console.log(error.message)
        }

    };


    getAllProperty = async (req,res) => {

      try {
        let getAll = await property.findAll({include : [{model : branch}]});
        if(getAll.length) {
          return res.send({message : "Success" , data : getAll})
        }else{
          return res.send({message : "Success" , data : []})
        }
      } catch (error) {
        return res.status(500).send({error : error.message})
      }

    };



}

module.exports = PropertyController;
