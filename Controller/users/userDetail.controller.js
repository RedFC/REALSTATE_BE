const db = require("../../Model");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const fs = require("fs");
const { validate } = require("../../Model/userDetail.model");
const cloudinary = require('../../config/cloudinary.config');
const randomstring = require("crypto-random-string");

const ImageData = db.imageData;
const Userdetail = db.usersdetail;
const Users = db.users;
const Op = db.Sequelize.Op;
class UserDetail {
  create = async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.send(error.details[0].message);

    Userdetail.findAll({
      where: {
        userId: req.user.id,
      },
    })
      .then(async (result) => {
        if (!result.length && result[0].dataValues.userId) {
        } else {
          const user = _.pick(req.body, [
            "firstName",
            "lastName",
            "address",
            "street",
            "country",
            "city",
            "state",
            "zipCode",
            "dob",
            "phoneNumber",
            "gender",
            "bio",
          ]);
          let imgData = _.pick(req.body, [
            "userId",
            "imageId",
            "typeId",
            "imageUrl",
            "imageType"
          ]);

          user.userId = req.user.id;

          if (req.file) {
            const rndStr = randomstring({ length: 10 });
            const dir = `uploads/users/${rndStr}/thumbnail/`;
            const path = req.file.path;
            cloudinary.uploads(path, dir)
              .then(async result => {
                if (result) {
                  fs.unlinkSync(path);

                  const createdUserDetail = await Userdetail.create(user);

                  if (createdUserDetail) {
                    imgData.userId = req.user.id;
                    imgData.imageId = result.id;
                    imgData.typeId = createdUserDetail.dataValues.id;
                    imgData.imageUrl = result.url;
                    imgData.imageType = "User";

                    const createdImg = await ImageData.create(imgData);
                    return res.send({ createdUserDetail, ImageData });
                  }
                  else {
                    return res.status(500).send({ message: "An error occured while Creating the Userdetails." });
                  }
                }
                else
                  return res.status(500).send({ message: "An error occured while Uploading the Image." });
              })
              .catch(error => {
                return res.status(500).send({ message: "An error occured while Uploading the Image." });
              });
          }
          else {
            user.imagePath = null;
            await Userdetail.create(user)
              .then((data) => {
                res.send(data);
              })
              .catch((err) => {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while creating the user details.",
                });
              });
          }

        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while creating the user details.",
        });
      });
  };

  update = async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.send(error.details[0].message);

    Userdetail.findOne({ raw: true, where: { userId: req.params.id } })
      .then(async (result) => {
        if (result) {
          const user = _.pick(req.body, [
            "firstName",
            "lastName",
            "address",
            "street",
            "country",
            "city",
            "state",
            "zipCode",
            "dob",
            "phoneNumber",
            "gender",
            "public_profile",
            "bio",
          ]);
          let imgData = _.pick(req.body, [
            "userId",
            "imageId",
            "typeId",
            "imageUrl",
            "imageType"
          ]);
          if (req.file) {
            let rndStr;
            let foundImgData = await ImageData.findOne({
              raw: true,
              where: { typeId: req.params.id, imageType: "User" },
            });

            if (foundImgData) {
              rndStr = foundImgData.imageId.slice(14, 24);
            }
            else {
              rndStr = randomstring({ length: 10 });
            }

            const dir = `uploads/users/${rndStr}/thumbnail/`;
            const path = req.file.path;

            cloudinary.uploads(path, dir)
              .then(async imgResult => {
                if (imgResult) {
                  fs.unlinkSync(path);

                  if (foundImgData === null) {
                    imgData.userId = req.user.id;
                    imgData.imageId = imgResult.id;
                    imgData.typeId = req.params.id;
                    imgData.imageUrl = imgResult.url;
                    imgData.imageType = "User";

                    user.userId = req.user.id;

                    let updatedUserdetails = await Userdetail.update(user, {
                      where: {
                        userId: req.params.id,
                      },
                    });
                    if (updatedUserdetails) {
                      const createdImg = await ImageData.create(imgData);
                      res.status(200).send({ message: "Successfully Updated!" });
                    }
                    else
                      res.status(500).send({
                        message: "Some error occurred while updating the Userdetails.",
                      });
                  }
                  else {
                    imgData.userId = req.user.id;
                    imgData.imageId = imgResult.id;
                    imgData.typeId = req.params.id;
                    imgData.imageUrl = imgResult.url;
                    imgData.imageType = "User";

                    cloudinary.remove(foundImgData.imageId)
                      .then(async rmvFile => {
                        if (rmvFile) {
                          const createdImg = await ImageData.update(imgData, {
                            where: { imageUrl: foundImgData.imageUrl }
                          });

                          user.userId = req.user.id;

                          let updatedUserdetails = await Userdetail.update(user, {
                            where: {
                              userId: req.params.id,
                            },
                          });
                          if (updatedUserdetails) {
                            res.status(200).send({ message: "Successfully Updated!" });
                          }
                          else
                            res.status(500).send({
                              message:
                                err.message ||
                                "Some error occurred while updating the Userdetails.",
                            });
                        }
                        else {
                          return res.status(500).send({ message: "An error occured while updating the Image." });
                        }
                      })
                      .catch(error => {
                        return res.status(500).send({ message: error.message || "An error occured while updating the Image." });
                      });
                  }
                }
                else
                  return res.status(500).send({ message: "An error occured while updating the Image." });
              })
              .catch(error => {
                return res.status(500).send({ message: error.message || "Some error occurred while updating the Userdetails." });
              });
          }
          else {
            user.userId = req.user.id;

            Userdetail.update(user, { where: { userId: req.params.id } })
              .then((data) => {
                res.status(200).send({ message: "User Detail Updated!" });
              })
              .catch((err) => {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while updating the Userdetails.",
                });
              });
          }

        }
        else {
          res.status(500).send({
            message: "Not found.",
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while updating the user details.",
        });
      });
  };
}

module.exports = UserDetail;
