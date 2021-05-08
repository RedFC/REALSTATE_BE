const db = require("../../Model");
const _ = require("lodash");
const { validate } = require("../../Model/apartments.model");

const apartment = db.ApartmentModel;
const proprty = db.PropertyModel
const Op = db.Sequelize.Op;
const FindPermission = require("../extras/FindPermission");
const { BranchModel } = require("../../Model");

class ApartMentController {

  create = async (req, res) => {
    
    try {
        let getPermission = await FindPermission(req.user.id);
        if(getPermission.canCreateProperty){
        let {error} = validate(req.body);
        if (error) return res.send(error.details[0].message);

        let schema = _.pick(req.body, [
            "propertyNumber",
            "floor",
            "flatNumber",
            "rentTypeId",
            "numberOfRooms",
            "numberOfBathrooms",
            "numberOfHalls",
            "numberOfKitchens",
            "rentAmount",
            "propertyId"
          ]);

        let createApartment = await apartment.create(schema);
        if(createApartment){
            res.send({message : "succesfully Createad",data : createApartment})
        }
    }
        else{
            res.status(403).send({message : "You Don't Have Permission"})
        }

    } catch (error) {
        console.log(error.message)
    }

    };

    getAllAppartments = async (req,res) => {

        try {
          let getAll = await apartment.findAll({include : [{model : proprty , include : [{
              model : BranchModel
          }]}]});
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

module.exports = ApartMentController;
