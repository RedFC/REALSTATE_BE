const dbConfig = require("../config/db.config.js");
const { UsersModel } = require("./user.model");
const { UsersDetailModel } = require("./userDetail.model");
const { roleModel } = require("./role.model");
const { permissions } = require("./permissions.model");
const { Emailverification } = require("./emailVerification.model");
const { ForgetPassword } = require("./forgetPassword.model");
const { blockUserModel } = require("./blockUser.model");
const { CategoryModel } = require("./category.model");
const { SubCategoryModel } = require("./subCategory.model");
const { Terms } = require("./termsCondition.model");
const { About } = require("./aboutUs.model");
const { ImageData } = require("./imageData.model");
const { exceptionModel } = require("./exception.model");
const { PropertyModel } = require("./property.model");
const { ApartmentModel } = require("./apartments.model");
const { BranchModel } = require("./branch.model");
const { UsersBranchModel } = require("./usersBranch.model");
const { PropertyContractModel } = require("./propertyContract.model");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  //   dialectOptions: dbConfig.dialectOptions,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = UsersModel(sequelize, Sequelize);

db.roles = roleModel(sequelize, Sequelize);
db.permissions = permissions(sequelize, Sequelize);
db.usersdetail = UsersDetailModel(sequelize, Sequelize);

db.Emailverification = Emailverification(sequelize, Sequelize);
db.ForgetPassword = ForgetPassword(sequelize, Sequelize);
db.blockUserModel = blockUserModel(sequelize, Sequelize);
db.category = CategoryModel(sequelize, Sequelize);
db.SubCategory = SubCategoryModel(sequelize, Sequelize);
db.termsCondition = Terms(sequelize, Sequelize);
db.aboutUs = About(sequelize, Sequelize);
db.imageData = ImageData(sequelize, Sequelize);
db.exceptionModel = exceptionModel(sequelize, Sequelize);
db.BranchModel = BranchModel(sequelize, Sequelize);
db.PropertyModel = PropertyModel(sequelize, Sequelize);
db.ApartmentModel = ApartmentModel(sequelize, Sequelize);
db.UsersBranchModel = UsersBranchModel(sequelize, Sequelize);
db.PropertyContractModel = PropertyContractModel(sequelize, Sequelize);

db.users.hasMany(db.permissions);
db.users.hasMany(db.usersdetail);

db.users.hasMany(db.permissions);
db.users.hasMany(db.usersdetail);

db.category.hasMany(db.SubCategory);
db.SubCategory.belongsTo(db.category)

module.exports = db;
