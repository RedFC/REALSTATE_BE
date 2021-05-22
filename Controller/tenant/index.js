const db = require("../../Model");
const _ = require("lodash");
const { validate } = require("../../Model/tenant.model");


const tenant = db.TenantModel;
const FindPermission = require("../extras/FindPermission");

class TenantController {

  create = async (req, res) => {
    try {

        let {error} = validate(req.body);
        if(error) return res.send({message : error.details[0].message});

        let schema = _.pick(req.body,['name','number','idNumber','branchId','nationality'])
        let create = await tenant.create(schema)
    
        if(create) {
            return res.send({message : "Success" , data : create});
        }
        else {
            return res.status(409).send({message : "Error While Creating Tenant"});
        }
    } catch (error) {
        return res.status(500).send({error : error.message})
    }

    };

    update = async (req, res) => {
      try {
  
  
          let schema = _.pick(req.body,['name','number','idNumber','branchId','nationality'])
          let getOne = await tenant.findOne({where :{ id : req.params.id}});
          if(!getOne){
            return res.send({message : "tenant not found"});
          }
          let create = await tenant.update(schema,{where : {id : req.params.id}})
          if(create[0]) {
              return res.send({message : "Updated"});
          }
          else {
              return res.status(409).send({message : "Error While updating Tenant"});
          }
      } catch (error) {
          return res.status(500).send({error : error.message})
      }
  
      };

    getAllTenant = async (req,res) => {

        try {
            let getAll = await tenant.findAll();
            if(getAll.length) {
              return res.send({message : "Success" , data : getAll})
            }else{
              return res.send({message : "Success" , data : []})
            }
          } catch (error) {
            return res.status(500).send({error : error.message})
          }

    }

    getOneTenant = async (req,res) => {
      try {
        let getAll = await tenant.findOne({where : {id : req.params.id}});
        if(getAll) {
          return res.send({message : "Success" , data : getAll})
        }else{
          return res.send({message : "Success" , data : []})
        }
      } catch (error) {
        return res.status(500).send({error : error.message})
      }
    }

    deleteTenant = async (req, res) => {

      try {
        
        let deleteTenant = await tenant.update({isDeleted : 1},{where : {id : req.params.id}});
        if(deleteTenant[0]){
          res.send({message : "Tenant Deleted Succesfully"});
        }

      } catch (error) {
        res.status(500).send({error : error.message})
      }

    }

}

module.exports = TenantController;
