const db = require("../../Model");
const _ = require("lodash");

const Category = db.category;
const subCategory = db.SubCategory;
const Op = db.Sequelize.Op;

const GetPermission = require("../extras/FindPermission");
const { validate } = require("../../Model/category.model");

class Categories {
    create = async (req, res) => {
        try {
          const { error } = validate(req.body);
          if (error) return res.status(400).send(error.details[0].message);
    
          const permissions = await GetPermission(req.user.id);
          if (permissions.canCreateProduct) {
            const category = _.pick(req.body, [
              "name",
              "isActive",
            ]);
    
            let _category = await Category.findOne({
              raw: true,
              where: {
                name: req.body.name,
              },
            });
    
            if (_category) {
              res.status(429).send({ message: "Already Exist!" });
            } else {
              Category.create(category)
                .then((data) => {
                  res.send(data);
                })
                .catch((err) => {
                  res.status(500).send({
                    message:
                      err.message ||
                      "Some error occurred while creating the category.",
                  });
                });
            }
          } else {
            return res
              .status(500)
              .send({ message: "Access Denied Permissions Not Acceptable !" });
          }
        } catch (err) {
          res.status(500).send({ message: err.message || "Something Went Wrong!" });
        }
      };
    
      update = async (req, res) => {
        try {
          const { error } = validate(req.body);
          if (error) return res.status(400).send(error.details[0].message);
    
          const permissions = await GetPermission(req.user.id);
    
          if (permissions && permissions.canEditCategory) {
            const category = _.pick(req.body, [
              "name",
              "isActive",
            ]);
            Category.update(category, {
              where: {
                id: req.params.categoryId,
              },
            })
              .then((data) => {
                res.status(200).send({ message: "Successfully Updated!" });
              })
              .catch((err) => {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while creating the category.",
                });
              });
          } else {
            return res.status(500).send({ message: "You don't have Permissions!" });
          }
        } catch (err) {
          res.status(500).send({ message: err.message || "Something Went Wrong" });
        }
      };
    
      getCategoriesWithSubCategory = async (req, res) => {
        try {
        //   let permissions = await GetPermission(req.user.id);
    
        //   let categoryType = parseInt(req.params.categoryType);
    
        //   if (permissions && permissions.canReadCategory) {
            let categories = await Category.findAll({
              nest:true,
              where: {
                isActive: true  ,
                isDelete: false,
              },
              include : [{
                  model : subCategory,required: false,
              }]
            });
            res
              .status(200)
              .send({ message: "Successfully Get!", data: categories });
        //   } else {
        //     return res.status(403).send({ message: "You don't have permissions!" });
        //   }
        } catch (err) {
          return res
            .status(403)
            .send({ message: err.message || "Something Went Wrong!" });
        }
      };
    
      getCategoryById = async (req, res) => {
        try {
          let permissions = await GetPermission(req.user.id);
    
          if (permissions && permissions.canReadCategory) {
            let categories = await Category.findAll({
              raw: true,
              where: {
                id: req.params.categoryId,
              },
            });
            res
              .status(200)
              .send({ message: "Successfully Get!", data: categories });
          } else {
            return res.status(403).send({ message: "You don't have permissions!" });
          }
        } catch (err) {
          return res
            .status(403)
            .send({ message: err.message || "Something Went Wrong!" });
        }
      };
    
      deleteCategory = async (req, res) => {
        try {
          let permissions = await GetPermission(req.user.id);
    
          if (permissions && permissions.canDeleteCategory) {
            let cat = {
              isDelete: true,
              isActive: false,
            };
    
            let categories = await Category.update(cat, {
              where: {
                id: req.params.categoryId,
              },
            });
    
            res.status(200).send({
              message: "Category Deleted Successfully!",
            });
          } else {
            return res.status(403).send({ message: "You don't have permissions!" });
          }
        } catch (err) {
          return res
            .status(500)
            .send({ message: err.message || "Something Went Wrong!" });
        }
      };
    }
    
    module.exports = Categories;