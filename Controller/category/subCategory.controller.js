const db = require("../../Model");
const _ = require("lodash");
const fs = require("fs");
const randomstring = require('crypto-random-string');

const SubCategory = db.SubCategory;
const Category = db.category;
const MerchantCategorys = db.merchantCategoryModel
const ImageData = db.imageData;
const product = db.product;
const merchantDetail = db.MerchantDetails
const Op = db.Sequelize.Op;

const Getpermissions = require("../extras/FindPermission");
const {
  getAllimagesByTypeAndTypeId
} = require('../extras/getImages');

const cloudinary = require('../../config/cloudinary.config');
const limit = require("../extras/DataLimit/index");
const {
  category
} = require("../../Model");

class SubCategories {
  create = async (req, res) => {
    try {
      const permissions = await Getpermissions(req.user.id);

      if (permissions) {
        if (permissions.canCreateProduct) {
          const subCategory = _.pick(req.body, [
            "name",
            "categoryId",
            "description",
            "image",
            "isActive",
          ]);

          let imgData = _.pick(req.body, [
            "userId",
            "imageId",
            "typeId",
            "imageUrl",
            "imageType"
          ]);

          let catInfo = await Category.findOne({
            raw: true,
            where: {
              id: req.body.categoryId,
            },
          });

          if (catInfo) {
            if (!req.file) {
              return res.status(402).send({
                message: "Image is required."
              });
            } else {
              const path = req.file.path;
              const rndStr = randomstring({
                length: 10
              });
              const dir = `uploads/subcategory/${rndStr}/thumbnail/`;
              cloudinary.uploads(path, dir)
                .then(async result => {
                  if (result) {
                    const createdSubcategory = await SubCategory.create(subCategory);
                    if (createdSubcategory) {
                      imgData.userId = req.user.id;
                      imgData.imageId = result.id;
                      imgData.typeId = createdSubcategory.dataValues.id;
                      imgData.imageUrl = result.url;
                      imgData.imageType = "Subcategory";

                      fs.unlinkSync(path);

                      const createdImg = await ImageData.create(imgData);

                      return res.send({
                        createdSubcategory,
                        createdImg
                      });
                    } else {
                      return res.status(500).send({
                        message: "An error occured while Creating the Subcategory."
                      });
                    }
                  } else {
                    return res.status(500).send({
                      message: "An error occured while Uploading the Image."
                    });
                  }
                })
                .catch(error => {
                  return res.status(500).send({
                    message: "An error occured while Uploading the Image."
                  });
                });
            }
          } else {
            res.status(500).send({
              message: "This category does not exist!"
            });
          }
        } else {
          return res
            .status(500)
            .send({
              message: "Access Denied Permissions Not Acceptable !"
            });
        }
      }
    } catch (err) {
      res.status(500).send({
        message: err.message || "Something Went Wrong"
      });
    }
  };

  getById = async (req, res) => {
    try {
      let permissions = await Getpermissions(req.user.id);

      let {
        id
      } = req.params;

      if (permissions && permissions.canReadCategory) {
        let subCategories = await Category.findAll({
          where: {
            isActive: true,
            isDelete: false,
          },
          include: [{
            model: SubCategory,
            where: {
              isActive: id,
              isDelete: false,
            },
          }, ],
        });
        res
          .status(200)
          .send({
            message: "Successfully Get!",
            data: subCategories
          });
      } else {
        return res.status(403).send({
          message: "You don't have permissions!"
        });
      }
    } catch (err) {
      return res
        .status(403)
        .send({
          message: err.message || "Something Went Wrong!"
        });
    }
  };

  get = async (req, res) => {
    try {
      let permissions = await Getpermissions(req.user.id);

      if (permissions && permissions.canReadCategory) {
        let subCategories = await Category.findAll({
          offset: parseInt(req.query.page) * limit.limit ?
            parseInt(req.query.page) * limit.limit :
            0,
          limit: req.query.page ? limit.limit : 1000000,
          where: {
            isActive: true,
            isDelete: false,
          },
          include: [{
            model: SubCategory,
            where: {
              isActive: req.params.categoryType,
              isDelete: false,
            },
          }, ],
        });
        let countData = {
          page: parseInt(req.query.page),
          pages: Math.ceil(subCategories.length / limit.limit),
          totalRecords: subCategories.length
        }
        res
          .status(200)
          .send({
            message: "Successfully Get!",
            data: subCategories,
            countData
          });
      } else {
        return res.status(403).send({
          message: "You don't have permissions!"
        });
      }
    } catch (err) {
      return res
        .status(403)
        .send({
          message: err.message || "Something Went Wrong!"
        });
    }
  };

  getAllSubCategory = async (req, res) => {
    try {
      let permissions = await Getpermissions(req.user.id);

      if (permissions && permissions.canReadCategory) {
        let subCategories = await SubCategory.findAll({
          offset: parseInt(req.query.page) * limit.limit ?
            parseInt(req.query.page) * limit.limit :
            0,
          limit: req.query.page ? limit.limit : 1000000,
          raw: true,
          where: {
            isActive: req.params.categoryType,
            isDelete: false,
          }
        });
        let countData = {
          page: parseInt(req.query.page),
          pages: Math.ceil(subCategories.length / limit.limit),
          totalRecords: subCategories.length
        }
        Promise.all(subCategories.map(async (x) => {
          let subcategory = new Object(x)
          return getAllimagesByTypeAndTypeId('Subcategory', x.id)
            .then(objs => {
              if (objs) {
                if (objs.getImages.length) {
                  subcategory['imgs'] = objs.getImages[0];
                  if (objs.getIndexs.length) {
                    subcategory['indexes'] = objs.getIndexs;
                  }
                }
              }
              return subcategory
            })
        })).then(data => {
          res.send({
            message: "Successfully Get!",
            data: data,
            countData
          })
        });
      } else {
        return res.status(403).send({
          message: "You don't have permissions!"
        });
      }
    } catch (err) {
      return res
        .status(403)
        .send({
          message: err.message || "Something Went Wrong!"
        });
    }
  };

  getAllSubCategoryByMerchant = async (req, res) => {
    try {
      let permissions = await Getpermissions(req.user.id);

      if (permissions && permissions.canReadCategory) {
        let subCategories = await MerchantCategorys.findAll({
          offset: parseInt(req.query.page) * limit.limit ?
            parseInt(req.query.page) * limit.limit :
            0,
          limit: req.query.page ? limit.limit : 1000000,
          where: {
            userId: req.params.merchantId
          },
          include: [{
            model: Category,
            where: {
              isActive: 1,
              isDelete: 0
            },
            include: [{
              model: SubCategory,

            }]
          }]
        });
        let countData = {
          page: parseInt(req.query.page),
          pages: Math.ceil(subCategories.length / limit.limit),
          totalRecords: subCategories.length
        }
        res
          .status(200)
          .send({
            message: "Successfully Get!",
            data: subCategories,
            countData
          });
      } else {
        return res.status(403).send({
          message: "You don't have permissions!"
        });
      }
    } catch (err) {
      return res
        .status(403)
        .send({
          message: err || "Something Went Wrong!"
        });

    }
  };

  updateSubCategory = async (req, res) => {
    try {
      const permissions = await Getpermissions(req.user.id);
      if (permissions && permissions.canEditCategory) {
        const category = _.pick(req.body, [
          "name",
          "description",
          "image",
          "isActive",
          "categoryId",
        ]);

        let imgData = _.pick(req.body, [
          "userId",
          "imageId",
          "typeId",
          "imageUrl",
          "imageType"
        ]);

        let catInfo = await Category.findOne({
          raw: true,
          where: {
            id: req.body.categoryId,
          },
        });

        let foundSubCategory = await SubCategory.findOne({
          raw: true,
          where: {
            id: req.params.subCategoryId
          },
        });

        if (!foundSubCategory)
          return res.status(404).send({
            message: "Not Found."
          });

        if (req.file) {
          let foundImgData = await ImageData.findOne({
            raw: true,
            where: {
              typeId: req.params.subCategoryId,
              imageType: "Subcategory"
            },
          });

          const path = req.file.path;
          const rndStr = foundImgData.imageId.slice(20, 30);
          const dir = `uploads/subcategory/${rndStr}/thumbnail/`;

          cloudinary.uploads(path, dir)
            .then(async result => {
              if (result) {
                fs.unlinkSync(path);

                imgData.userId = req.user.id;
                imgData.imageId = result.id;
                imgData.typeId = req.params.subCategoryId;
                imgData.imageUrl = result.url;
                imgData.imageType = "Subcategory";

                cloudinary.remove(foundImgData.imageId)
                  .then(async rmvFile => {
                    if (rmvFile) {
                      const updatedImgData = await ImageData.update(imgData, {
                        where: {
                          typeId: req.params.subCategoryId
                        }
                      });

                      let updatedSubCategory = await SubCategory.update(category, {
                        where: {
                          id: req.params.subCategoryId,
                        },
                      });
                      if (updatedSubCategory) {
                        return res.status(200).send({
                          message: "Successfully Updated!"
                        });
                      } else
                        return res.status(500).send({
                          message: err.message ||
                            "Some error occurred while updating the Subcategory.",
                        });
                    } else {
                      return res.status(500).send({
                        message: "An error occured while updating the Image."
                      });
                    }
                  })
                  .catch(error => {
                    return res.status(500).send({
                      message: error.message || "An error occured while updating the Image."
                    });
                  });
              } else {
                return res.status(500).send({
                  message: "An error occured while updating the Image."
                });
              }
            })
            .catch(error => {
              return res.status(500).send({
                message: error.message || "An error occured while updating the Image."
              });
            });
        } else if (catInfo) {
          let updatedSubCategory = await SubCategory.update(category, {
              where: {
                id: req.params.subCategoryId,
              },
            })
            .then((data) => {
              res.status(200).send({
                message: "Successfully Updated!"
              });
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message ||
                  "Some error occurred while updating the subcategory.",
              });
            });
        } else {
          res.status(500).send({
            message: "This category does not exist!"
          });
        }
      } else {
        return res.status(500).send({
          message: "You don't have Permissions!"
        });
      }
    } catch (err) {
      res.status(500).send({
        message: err.message || "Something Went Wrong"
      });
    }
  };

  deleteSubCategory = async (req, res) => {
    try {
      let permissions = await Getpermissions(req.user.id);

      if (permissions && permissions.canDeleteCategory) {
        let cat = {
          isDelete: true,
        };

        let getProductByCategory = await product.findOne({
          where: {
            subcategoryId: req.params.subCategoryId
          }
        })
        if (getProductByCategory) {
          res.status(200).send({
            message: "This SubCategory Is Associated To A product You Cannot Delete At This Moment",
          });
        } else {
          let Subcategories = await SubCategory.update(cat, {
            where: {
              id: req.params.subCategoryId,
            },
          });

          res.status(200).send({
            message: "SubCategory Deleted Successfully!",
          });
        }
      } else {
        return res.status(403).send({
          message: "You don't have permissions!"
        });
      }
    } catch (err) {
      return res
        .status(500)
        .send({
          message: err.message || "Something Went Wrong!"
        });
    }
  };
}
module.exports = SubCategories;