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
                Name: "RealState",
                userId: null,
            };

            const user = {
                userName: "forex",
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
        } catch (e) {
            reject(e);
        }
    })
};