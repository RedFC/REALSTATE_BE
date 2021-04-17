const db = require("../../Model");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const ForgetPasswordEmailSend = require("../extras/ForgetPasswordSend");
const sendVerificationEmail = require("../extras/EmailverificationSend");
const forgetpassword = require("../extras/ForgetPasswordVerification");
const {
    setUserStateToken,
    deleteRedisKey,
    deleteUserStateToken,
    getUserStateToken
} = require(
    "../../cache/redis.service"
);
const moment = require("moment");
// const client = require('twilio')(
//     config.get('twilio.Account_SID'),
//     config.get('twilio.Account_TOKEN')
// );
moment.fn.fromNow_seconds = function (a) {
    var duration = moment(this).diff(moment(), 'seconds');
    return duration;
}
const fs = require('fs');
var privateKEY = fs.readFileSync('config/cert/private.key', 'utf8');

const Users = db.users;
const UsersDetail = db.usersdetail
const permissions = db.permissions;
const forgetpasswordtable = db.ForgetPassword;
const Op = db.Sequelize.Op;

const {
    getAllimagesByTypeAndTypeId
} = require('../extras/getImages');

class Authentication {

    startService = async (req, res) => {

        try {

            client
                .verify
                .services(config.get("serviceId"))
                .verifications
                .create({
                    to: req.body.phone,
                    channel: 'sms'
                })
                .then(async message => {
                    res.send({
                        success: true,
                        message: "Verification code sent.",
                        sid: message.sid,
                        userId: req.user.id
                    });
                })
                .catch(err => {
                    console.log(err);
                });

        } catch (e) {
            res.send({
                success: false,
                message: e.message
            })
        }
    };

    checkService = async function (req, res) {
        try {

            if (req.user.id == req.body.userId) {
                client
                    .verify
                    .services(config.get("serviceId"))
                    .verificationChecks
                    .create({
                        to: req.body.phone,
                        code: req.body.code
                    })
                    .then(async message => {
                        if (message.valid == true) {
                            let users = await Users.findAll({
                                raw: true,
                                nest: true,
                                include: [{
                                    model: UsersDetail,
                                    where: {
                                        phoneNumber: req.body.phone
                                    }
                                }]
                            });

                            if (users.length) {
                                let update = await UsersDetail.update({
                                    phoneNumber: null
                                }, {
                                    where: {
                                        phoneNumber: req.body.phone
                                    }
                                });
                                if (update[0]) {
                                    let updateCurrentUserNumber = await UsersDetail.update({
                                        phoneNumber: req.body.phone
                                    }, {
                                        where: {
                                            userId: req.body.userId
                                        }
                                    });
                                    if (updateCurrentUserNumber[0]) {
                                        res.send({
                                            message: message,
                                            success: true,
                                            verified: true
                                        });
                                    }
                                }
                            } else {
                                let updateCurrentUserNumber = await UsersDetail.update({
                                    phoneNumber: req.body.phone
                                }, {
                                    where: {
                                        userId: req.body.userId
                                    }
                                });
                                if (updateCurrentUserNumber[0]) {
                                    await users.update({
                                        otpVerified: true
                                    }, {
                                        where: {
                                            id: req.body.userId
                                        }
                                    });
                                    res.send({
                                        message: message,
                                        success: true,
                                        verified: true
                                    });
                                }
                            }

                        } else {
                            res.send({
                                succesS: false,
                                message: "Verification failed"
                            })
                        }
                    })
                    .catch(err => {
                        res
                            .status(500)
                            .send({
                                message: "something went wrong !",
                                logs: err
                            });
                    });
            }

        } catch (e) {
            res.send({
                success: false,
                message: e.message
            })
        }
    }

    Auth = async (req, res) => {
        const {
            error
        } = validation(req.body);
        if (error)
            return res
                .status(400)
                .send(error.details[0].message);

        Users
            .findOne({
                raw: true,
                where: {
                    email: req.body.email,
                    emailVerified: true
                }
            })
            .then(async (result) => {
                if (result) {
                    if (result.isBlocked) {
                        return res
                            .status(403)
                            .send({
                                message: "Your Account is Suspended!"
                            });
                    }
                    if (result.isDelete) {
                        return res
                            .status(403)
                            .send({
                                message: "Your Account Has Been Deleted!"
                            });
                    }

                    let password = await bcrypt.compare(req.body.password, result.password);
                    if (!password)
                        return res
                            .status(400)
                            .send({
                                message: "Invalid Email Or Password!"
                            });

                    try {
                        let Token = AuthTokenGen(result.id);

                        setUserStateToken(Token, moment(moment().add(48, 'hours')).fromNow_seconds())
                            .then(
                                (success) => {
                                    console.log("Refresh Token Recorded")
                                }
                            )
                            .catch((error) => {
                                console.log(error);
                                res.json(error);
                            });
                        let members = await Users.findAll({
                            raw: true,
                            nest: true,
                            include: [{
                                model: permissions,
                                where: {
                                    userId: result.id
                                }
                            }]
                        });
                        Promise.all(members.map(async (x) => {
                            let user = new Object(x)
                            return getAllimagesByTypeAndTypeId('User', x.id)
                                .then(objs => {
                                    if (objs) {
                                        if (objs.getImages.length) {
                                            user['imgs'] = objs.getImages[0];
                                            if (objs.getIndexs.length) {
                                                user['indexes'] = objs.getIndexs;
                                            }
                                        }
                                    }
                                    return user
                                })
                        })).then(data => {
                            res
                                .header("x-auth-token", Token)
                                .status(200)
                                .send({
                                    data: data,
                                    accessToken: Token
                                });
                        });

                    } catch (err) {
                        return res.send(err);
                    }

                } else {
                    res
                        .status(401)
                        .send({
                            message: "Invalid Email Or Password!!."
                        });
                }
            })
            .catch((err) => {
                res
                    .status(500)
                    .send({
                        message: err.message
                    });
            });
    };

    Logout = async (req, res) => {
        getUserStateToken(req.auth).then(data => {
            if (data == null) {
                console.log("Expired Token!")
                res.status(401).send({
                    success: true,
                    message: "Logged out successfully",
                    code: 200,
                });
                return;
            } else {
                console.log("Non Expired Token!")
                deleteUserStateToken(req.auth)
                    .then(success => {
                        if (success) {
                            res.send({
                                message: "Logged out successfully!"
                            })
                        }
                    })
                    .catch((err) => {
                        res
                            .status(500)
                            .send(err);
                    })
            }
        })
    };

    ForgetpasswordEmail = (req, res) => {
        const email = req.body.email;
        if (email) {
            Users
                .findOne({
                    raw: true,
                    where: {
                        email: email,
                    }
                })
                .then((result) => {
                    const url = req.protocol + "://" + req.get("host");
                    if (result && result.emailVerified == true) {
                        console.log(result);
                        ForgetPasswordEmailSend(
                            url,
                            req,
                            res,
                            result.id,
                            result.email,
                            result.userName
                        );
                    } else if (result && result.emailVerified == false) {
                        sendVerificationEmail(url, req, res, result.id, result.email, result.userName);
                    } else {
                        res.status(409).send({
                            message: "User Not Found"
                        })
                    }

                })
                .catch((err) => {
                    res.send(err.message);
                });
        } else {
            res.send({
                message: "Please Enter A email"
            });
        }
    };

    Template = (req, res) => {
        const token = req.params.key;

        forgetpassword(token, res)
            .then((res) => res)
            .catch((err) => console.log(err));
    };

    ResetPassword = async (req, res) => {
        let token = req.params.token;
        let password = req.body.password;

        const salt = await bcrypt.genSalt(10);
        let passwordhased = await bcrypt.hash(password, salt);

        forgetpasswordtable
            .findOne({
                raw: true,
                where: {
                    token: token
                }
            })
            .then((result) => {
                Users
                    .update({
                        password: passwordhased
                    }, {
                        where: {
                            id: result.userId
                        }
                    })
                    .then((result) => {
                        forgetpasswordtable
                            .update({
                                isExpired: true
                            }, {
                                where: {
                                    token: token
                                }
                            })
                            .then((result) => res.send({
                                message: "Updated Password"
                            }));
                        res.send({
                            message: "Updated Password"
                        });
                    });
            });
    };
}

function AuthTokenGen(id) {
    var i = "FOREX";
    var s = "forex@gmail.com";
    var signOptions = {
        issuer: i,
        subject: s,
        algorithm: "RS256"
    };
    var payload = {
        id: id
    };
    // jwt.sign(payload, config.get("JWT.privateKey"))
    var token = jwt.sign(payload, privateKEY, signOptions);
    // This function is pushing the jwt to a cache Any jwt not in this cache is not
    // usable
    return token;
}

function validation(request) {
    const schema = {
        email: Joi
            .string()
            .required()
            .email(),
        password: Joi
            .string()
            .required()
    };

    return Joi.validate(request, schema);
}

module.exports = Authentication;