const db = require("../../Model");
const _ = require("lodash");
const Block = db.blockUserModel;
const UserDetail = db.usersdetail;
const Permissions = db.permissions;
const User = db.users;
const Op = db.Sequelize.Op;
const limit = require("../extras/DataLimit/index");
class BlockUser {
    create = async (req, res) => {
        try {
            if (req.user.id == req.params.id)
                return res.status(409).send({ message: "You Can Not Block Your Self" });
            let blockedUser = await Block.findOne({
                where: {
                    blockerId: req.user.id,
                    blockedId: req.params.id
                }
            });
            if (!blockedUser) {
                let blockedUser = await Block.findOne({
                    where: {
                        blockerId: req.params.id,
                        blockedId: req.user.id
                    }
                });
                if (blockedUser)
                    return res.status(409).send({ message: "This User Is Already Blocked" });
            }
            if (blockedUser)
                return res.status(409).send({ message: "This User Is Already Blocked" });

            let data = {
                blockedId: req.params.id,
                blockerId: req.user.id
            }

            let blockuser = await Block.create(data);
            if (blockuser)
                return res.send({ message: "User has Been Blocked" });
        }

        catch (err) {
            return res
                .status(500)
                .send({
                    message: err.message || "Something Went Wrong"
                });
        }
    };

    getBlockedUsers = async (req, res) => {
        try {
            let getBlockedUsers = await Block.findAll({
                raw: true,
                nest: true,
                offset:
                    parseInt(req.query.page) * limit.limit
                        ? parseInt(req.query.page) * limit.limit
                        : 0,
                limit: req.query.page ? limit.limit : 1000000,
                where: {
                    blockerId: req.user.id
                }
            });
            if (getBlockedUsers.length) {
                let users = getBlockedUsers;
                let counter = 0;
                let allUsers = [];
                users.forEach(async (elem, index, array) => {
                    let blockedid = elem.blockedId;
                    allUsers.push(blockedid);
                    counter++;
                    if (counter == array.length) {

                        let getusers = await User.findAll({
                            where: {
                                id: allUsers
                            },
                            include: [
                                {
                                    model: UserDetail
                                }
                            ]
                        });
                        let countData = {
                            page: parseInt(req.query.page),
                            pages: Math.ceil(allUsers.length / limit.limit),
                            totalRecords: allUsers.length
                        }
                        res.send({ getusers, countData })
                    }
                });
            } else
                res
                    .status(400)
                    .send({ message: "No Users found." });

        }
        catch (err) {
            res.send({
                message: err.message || "Something Went Wrong!"
            });
        }
    };
}
module.exports = BlockUser;
