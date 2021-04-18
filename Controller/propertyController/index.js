const db = require("../../Model");
const _ = require("lodash");
const { validate } = require("../../Model/property.model");
const FindPermission = require("../extras/FindPermission");


const property = db.PropertyModel; 
const Op = db.Sequelize.Op;

class PropertyController {

  create = async (req, res) => {
    
    try {
        let getPermission = await FindPermission(req.user.id);
        if(getPermission.canCreateProperty){
        let {error} = validate(req.body);
        if (error) return res.send(error.details[0].message);

        let schema = _.pick(req.body, [
            "paciNumber",
            "buildingNumber",
            "totalApartment",
            "area",
            "streetName",
            "BlockNumber",
            "harisNumber",
            "harisContactNumber",
          ]); 
          if(req.body.avenue){
            schema.avenue = req.body.avenue
          }

        let createProperty = await property.create(schema);
        if(createProperty){
            res.send({message : "succesfully Createad",data : createProperty})
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

module.exports = PropertyController;
