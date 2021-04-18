const db = require("../../Model");
const _ = require("lodash");
const { validate } = require("../../Model/apartments.model");

const apartment = db.ApartmentModel; 
const Op = db.Sequelize.Op;

class ApartMentController {

  create = async (req, res) => {
    
    try {
        let {error} = validate(req.body);
        if (error) return res.send(error.details[0].message);

        let schema = _.pick(req.body, [
            "paciNumber",
            "floor",
            "flatNumber",
            "monthlyRent",
            "propertyId"
          ]);

        let createApartment = await apartment.create(schema);
        if(createApartment){
            res.send({message : "succesfully Createad",data : createApartment})
        }

    } catch (error) {
        console.log(error.message)
    }

    };

}

module.exports = ApartMentController;
