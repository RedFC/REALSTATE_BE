const db = require("../../Model");
const _ = require("lodash");
const FindPermission = require("../extras/FindPermission");
const limit = require("../extras/DataLimit/index");
const TermsCondition = db.termsCondition;
const Op = db.Sequelize.Op;

class TermsAndCondition {
    create = async (req, res) => {
        try {
            let getPermission = await FindPermission(req.user.id);
            if (getPermission && getPermission.canCreateTermsCondition) {
                const terms = _.pick(req.body, ["title", "terms", "isActive"]);
                let termsCondition = await TermsCondition.create(terms);
                return res.status(200).send(termsCondition);
            }
            return res.send({
                message: "You don't have permission to perform this action!",
            });
        } catch (err) {
            return res
                .status(500)
                .send({
                    message: err.message || "Something Went Wrong"
                });
        }
    };

    getSpecificTerms = async (req, res) => {
        try {
            let getPermission = await FindPermission(req.user.id);
            if (getPermission && getPermission.canReadTermsCondition) {
                let termsCondition = await TermsCondition.findOne({
                    where: {
                        id: req.params.id,
                        isActive: true
                    }
                });
                if (termsCondition) {
                    return res.status(200).send(termsCondition);
                } else {
                    return res.status(500).send({
                        message: "Not Found!"
                    });
                }
            }
            return res.send({
                message: "You don't have permission to perform this action!",
            });
        } catch (err) {
            return res
                .status(500)
                .send({
                    message: err.message || "Something Went Wrong"
                });
        }
    };

    getAllTerms = async (req, res) => {
        try {
            let getPermission = await FindPermission(req.user.id);
            if (getPermission && getPermission.canReadTermsCondition) {
                let termsCondition = await TermsCondition.findAll({
                    offset: parseInt(req.query.page) * limit.limit ?
                        parseInt(req.query.page) * limit.limit :
                        0,
                    limit: req.query.page ? limit.limit : 1000000,
                    where: {
                        isActive: true
                    }
                });
                let countData = {
                    page: parseInt(req.query.page),
                    pages: Math.ceil(termsCondition.length / limit.limit),
                    totalRecords: termsCondition.length
                }
                return res.send({
                    termsCondition,
                    countData
                });
            }
            return res.send({
                message: "You don't have permission to perform this action!",
            });
        } catch (err) {
            return res
                .status(500)
                .send({
                    message: err.message || "Something Went Wrong"
                });
        }
    };

    getAllTermsUsers = async (req, res) => {

        let termsCondition = await TermsCondition.findAll({
            offset: parseInt(req.query.page) * limit.limit ?
                parseInt(req.query.page) * limit.limit :
                0,
            limit: req.query.page ? limit.limit : 1000000,
            where: {
                isActive: true
            }
        });
        if (!termsCondition.length) return res.send({
            message: "Terms And Condition Not Found"
        });
        let countData = {
            page: parseInt(req.query.page),
            pages: Math.ceil(termsCondition.length / limit.limit),
            totalRecords: termsCondition.length
        }
        return res.send({
            termsCondition,
            countData
        });

    }

    updateTerms = async (req, res) => {
        try {
            let getPermission = await FindPermission(req.user.id);
            if (getPermission && getPermission.canEditTermsCondition) {
                const terms = _.pick(req.body, ["title", "terms", "isActive"]);
                let foundTerms = await TermsCondition.findOne({
                    where: {
                        id: req.params.id
                    }
                });
                if (foundTerms) {
                    let termsCondition = await TermsCondition.update(terms, {
                        where: {
                            id: req.params.id,
                        }
                    });
                    return res.send({
                        message: "Successfully updated"
                    });
                } else {
                    return res.status(500).send({
                        message: "Not found!"
                    });
                }
            }
            return res.send({
                message: "You don't have permission to perform this action!",
            });
        } catch (err) {
            return res
                .status(500)
                .send({
                    message: err.message || "Something Went Wrong"
                });
        }
    };

    deleteTerms = async (req, res) => {
        try {
            let getPermission = await FindPermission(req.user.id);
            if (getPermission && getPermission.canDeleteTermsCondition) {
                let foundTerms = await TermsCondition.findOne({
                    where: {
                        id: req.params.id
                    }
                });
                if (foundTerms) {
                    let termsCondition = await TermsCondition.update({
                        isActive: false
                    }, {
                        where: {
                            id: req.params.id,
                        }
                    });
                    return res.send({
                        message: "Successfully deleted"
                    });
                } else {
                    return res.status(500).send({
                        message: "Not found!"
                    });
                }
            }
            return res.send({
                message: "You don't have permission to perform this action!",
            });
        } catch (err) {
            return res
                .status(500)
                .send({
                    message: err.message || "Something Went Wrong"
                });
        }
    };
}
module.exports = TermsAndCondition;