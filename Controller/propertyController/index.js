const db = require("../../Model");
const _ = require("lodash");
const { validate } = require("../../Model/property.model");
const FindPermission = require("../extras/FindPermission");
const randomstring = require('crypto-random-string');

const cloudinary = require('../../config/cloudinary.config');
const property = db.PropertyModel; 
const branch = db.BranchModel; 
const ImageData = db.imageData;
const Op = db.Sequelize.Op;

class PropertyController {

  create = async (req, res) => {
    
    try {
        let getPermission = await FindPermission(req.user.id);
        if(getPermission.canCreateProperty){
        let {error} = validate(req.body);
        if (error) return res.send(error.details[0].message);

        let imgArr = [];

        let schema = _.pick(req.body, [
            "branchId",
            "propertyNumber",
            "totalApartment",
            "area",
            "streetName",
            "GuardContact",
            'description',
            'longitude',
            'latitude'
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
              
              if(req.files.length){

                let files = req.files;
                const rndStr = randomstring({ length: 10 });
                const dir = `uploads/property/${rndStr}/`;

                files.map((x) => {

                  cloudinary
                  .uploads(x.path, dir)
                  .then(async (uploadRslt) => {
                    if (uploadRslt) {
                      await ImageData.create({imageType: "Property", imageId: uploadRslt.id, typeId: createProperty.id, imageUrl: uploadRslt.url, userId: req.user.id})
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

              return res.send({message : "Property Created"});


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

<<<<<<< Updated upstream
=======
    getProperty = async (req,res) => {

      try {
        let get = await property.findAll({where :{id : req.params.id},include : [{model : branch}]});
        if(get) {
          return res.send({message : "Success" , data : get})
        }else{
          return res.send({message : "Not Found"})
        }
      } catch (error) {
        return res.status(500).send({error : error.message})
      }

    };



    updateProperty = async (req,res) => {


      try {
        let getPermission = await FindPermission(req.user.id);
        if(getPermission.canCreateProperty){


        let schema = _.pick(req.body, [
            "branchId",
            "propertyNumber",
            "totalApartment",
            "area",
            "streetName",
            "GuardContact",
            'description',
            'longitude',
            'latitude'
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

          let createProperty = await property.update(schema,{where : {id : req.params.id}});
            if(createProperty[0]){
              
              if(req.files.length){

                await ImageData.destroy({
                  where: {
                      typeId : req.params.id
                  }
                });

                let files = req.files;
                const rndStr = randomstring({ length: 10 });
                const dir = `uploads/property/${rndStr}/`;

                files.map((x) => {

                  cloudinary
                  .uploads(x.path, dir)
                  .then(async (uploadRslt) => {
                    if (uploadRslt) {
                      await ImageData.create({imageType: "Property", imageId: uploadRslt.id, typeId: req.params.id, imageUrl: uploadRslt.url, userId: req.user.id})
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

              return res.send({message : "Property Updated"});

            }        
        }
        else{
            res.status(403).send({message : "You Don't Have Permission"})
        }

        } catch (error) {
            console.log(error.message)
        }


    }

>>>>>>> Stashed changes


}

module.exports = PropertyController;
