const db = require("../../Model");
const _ = require("lodash");
const FindPermission = require("../extras/FindPermission");

const rentContract = db.RentContractModel; 
const property = db.PropertyModel;
const appartment = db.ApartmentModel;
const tenant = db.TenantModel;
const renttype = db.RentModel;

const Op = db.Sequelize.Op;

class rentContractController {

  create = async (req, res) => {
    
    try {
        let getPermission = await FindPermission(req.user.id);
        if(getPermission.canCreateProperty){

        let schema = _.pick(req.body, [
            "propertyId",
            "appartmentId",
            "tenantId",
            "renttype",
            "amount"
          ]);

          let properties = await property.findAll();
          if(properties.length){
            let propertys = await property.findOne({where : {id : req.body.propertyId}});
            if(!propertys){
              return res.send({message : "Required property Not Found"});
            }
          }else{
            return res.send({message : "properties Not Found please create One"});
          }

          let appartmentss = await appartment.findAll();
          if(appartmentss.length){
            let appartments = await appartment.findOne({where : {id : req.body.appartmentId}});
            if(!appartments){
              return res.send({message : "Required appartment Not Found"});
            }
          }else{
            return res.send({message : "appartments Not Found please create One"});
          }

          let tenantss = await tenant.findAll();
          if(tenantss.length){
            let tenants = await tenant.findOne({where : {id : req.body.tenantId}});
            if(!tenants){
              return res.send({message : "Required tenant Not Found"});
            }
          }else{
            return res.send({message : "tenants Not Found please create One"});
          }
          
          let types = await renttype.findAll();
          if(types.length){
            let type = await renttype.findOne({where : {id : req.body.renttype}});
            if(!type){
              return res.send({message : "rent type tenant Not Found"});
            }
          }else{
            return res.send({message : "rent Types Not Found please create One"});
          }


          let rentcontract = await rentContract.create(schema);
            if(rentcontract){
              
              return res.send({message : "Rent Contract Created"});

            }        
        }
        else{
            res.status(403).send({message : "You Don't Have Permission"})
        }

        } catch (error) {
            console.log(error.message)
        }

    };

}

module.exports = rentContractController;
