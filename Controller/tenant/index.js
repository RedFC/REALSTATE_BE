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

        let schema = _.pick(req.body,['name','number','idNumber','nationality'])
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

}

module.exports = TenantController;
