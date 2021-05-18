const db = require("../../Model");
const _ = require("lodash");
const { validate } = require("../../Model/apartments.model");

const apartment = db.ApartmentModel;
const proprty = db.PropertyModel
const Op = db.Sequelize.Op;
const FindPermission = require("../extras/FindPermission");
const { BranchModel, imageData } = require("../../Model");

const ImageData = db.imageData;
const randomstring = require('crypto-random-string');
const cloudinary = require('../../config/cloudinary.config');

class ApartMentController {

  create = async (req, res) => {
    
    try {
        let {error} = validate(req.body);
        if (error) return res.send(error.details[0].message);

        let schema = _.pick(req.body, [
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

          if(req.files.length){

            let files = req.files;
            const rndStr = randomstring({ length: 10 });
            const dir = `uploads/apparment/${rndStr}/`;

            files.map((x) => {

              cloudinary
              .uploads(x.path, dir)
              .then(async (uploadRslt) => {
                if (uploadRslt) {
                  await ImageData.create({imageType: "Appartment", imageId: uploadRslt.id, typeId: createApartment.id, imageUrl: uploadRslt.url, userId: req.user.id})
                  fs.unlinkSync(x.path);
                } else {
                  console.log({ code: 501, success: false, message: "An error occured while uploading the Image." });
                }
              })
              .catch(error => {
                console.log({
                  code: 501,
                  success: false,
                  message: error.message || "An error occured while uploading the Image."
                });
              });

            });


          }

            res.send({message : "succesfully Createad"})
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
    
      getAppartment = async (req,res) => {

        try {
          let get = await apartment.findAll({where : {id : req.params.id},include : [{model : proprty , include : [{
              model : BranchModel
          }]}]});
          if(get) {
            return res.send({message : "Success" , data : get})
          }else{
            return res.send({message : "Not Found"})
          }
        } catch (error) {
          return res.status(500).send({error : error.message})
        }
  
      };

    updateAppartment = async (req,res) => {
      
      try {
        let getPermission = await FindPermission(req.user.id);
        if(getPermission.canCreateProperty){

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

        let createApartment = await apartment.update(schema,{where : {id : req.params.id}});
        if(createApartment[0]){

          

          if(req.files.length){

            await ImageData.destroy({
              where: {
                  typeId : req.params.id
              }
            });

            let files = req.files;
            const rndStr = randomstring({ length: 10 });
            const dir = `uploads/apparment/${rndStr}/`;

            files.map((x) => {
              console.log(x);
              cloudinary
              .uploads(x.path, dir)
              .then(async (uploadRslt) => {
                if (uploadRslt) {
                  await ImageData.create({imageType: "Appartment", imageId: uploadRslt.id, typeId: req.params.id, imageUrl: uploadRslt.url, userId: req.user.id})
                  fs.unlinkSync(x.path);
                } else {
                  console.log({ code: 501, success: false, message: "An error occured while uploading the Image." });
                }
              })
              .catch(error => {
                console.log({
                  code: 501,
                  success: false,
                  message: error.message || "An error occured while uploading the Image."
                });
              });

            });

          
          }
          res.send({message : "succesfully Updated"})
          
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

module.exports = ApartMentController;
