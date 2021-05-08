const db = require("./Model");
const bcrypt = require("bcrypt");
const {
    superAdminPermission
} = require("./Controller/extras/Permission");

exports.default_settings = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let role;
            let permissionDefine;
            let propertyContract;
            let rentType;

            role = await db.roles.findOne({
                where: {
                    roleName: "Super Admin"
                }
            });
            if (!role) {
                await db.roles.create({
                    roleName: "Super Admin",
                });
            }

            role = await db.roles.findOne({
                where: {
                    roleName: "Admin"
                }
            });
            if (!role) {
                await db.roles.create({
                    roleName: "Admin",
                });
            };

            role = await db.roles.findOne({
                where: {
                    roleName: "Staff"
                }
            });
            if (!role) {
                await db.roles.create({
                    roleName: "Staff",
                });
            };

            role = await db.roles.findOne({
                where: {
                    roleName: "User"
                }
            });
            if (!role) {
                await db.roles.create({
                    roleName: "User",
                });
            };

            permissionDefine = superAdminPermission;

            let details = {
                name: "RealState",
                userId: null,
            };

            const user = {
                name : "RealState Market",
                userName: "RealState",
                email: "superadmin@RealState.com",
                password: "password",
                emailVerified: 1,
            };
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);

            let foundUser = await db.users.findOne({
                where: {
                    email: "superadmin@RealState.com"
                },
            });
            if (!foundUser) {
                let userResponse = await db.users.create(user);
                const newUserId = userResponse.dataValues.id;
                details.userId = newUserId;
                permissionDefine.userId = newUserId;
                permissionDefine.roleId = 1;
                let foundDetails = await db.usersdetail.findOne({
                    where: {
                        Name: "RealState",
                        userId: newUserId
                    },
                });
                if (!foundDetails) {
                    await db.usersdetail.create(details);

                    let foundPermissions = await db.permissions.findAll();
                    if (foundPermissions.length == 0) {
                        await db.permissions.create(permissionDefine);
                    }
                }

                resolve()
            } else {
                reject();
            }


            propertyContract = await db.PropertyContractModel.findOne({
                where: {
                    type: "Owns The Property"
                }
            });
            if (!propertyContract) {
                await db.PropertyContractModel.create({
                    type: "Owns The Property"
                });
            }

            propertyContract = await db.PropertyContractModel.findOne({
                where: {
                    type: "Rent The Property"
                }
            });
            if (!propertyContract) {
                await db.PropertyContractModel.create({
                    type: "rent The Property"
                });
            }

            propertyContract = await db.PropertyContractModel.findOne({
                where: {
                    type: "Manage The Property"
                }
            });
            if (!propertyContract) {
                await db.PropertyContractModel.create({
                    type: "Manage The Property"
                });
            }

            rentType = await db.RentModel.findOne({
                where : {
                    typeName : "Daily"
                }
            });
            if (!rentType) {
                await db.RentModel.create({
                    typeName: "Daily"
                });
            }


            rentType = await db.RentModel.findOne({
                where : {
                    typeName : "Monthly"
                }
            });
            if (!rentType) {
                await db.RentModel.create({
                    typeName: "Monthly"
                });
            }


            rentType = await db.RentModel.findOne({
                where : {
                    typeName : "every three month"
                }
            });
            if (!rentType) {
                await db.RentModel.create({
                    typeName: "every three month"
                });
            }

            rentType = await db.RentModel.findOne({
                where : {
                    typeName : "every four month"
                }
            });
            if (!rentType) {
                await db.RentModel.create({
                    typeName: "every four month"
                });
            }

            rentType = await db.RentModel.findOne({
                where : {
                    typeName : "half an year"
                }
            });
            if (!rentType) {
                await db.RentModel.create({
                    typeName: "half an year"
                });
            }

            rentType = await db.RentModel.findOne({
                where : {
                    typeName : "yearly Rent"
                }
            });
            if (!rentType) {
                await db.RentModel.create({
                    typeName: "yearly Rent"
                });
            }






        } catch (e) {
            reject(e);
        }
    })
};