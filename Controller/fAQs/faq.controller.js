const db = require("../../Model");
const _ = require("lodash");
const FindPermission = require("../extras/FindPermission");
const FAQs = db.Faqs;
const Op = db.Sequelize.Op;

class FAQS {
    create = async (req, res) => {
        try {
            let getPermission = await FindPermission(req.user.id);
            if (getPermission && getPermission.canCreateFaqs) {
                const faqs = _.pick(req.body, ["question", "answer", "isActive"]);
                let Faqs = await FAQs.create(faqs);
                return res.status(200).send(Faqs);
            }
            return res.send({
                message: "You don't have permission to perform this action!",
            });
        } catch (err) {
            return res
                .status(500)
                .send({ message: err.message || "Something Went Wrong" });
        }
    };

    getSpecificFaqs = async (req, res) => {
        try {
            let getPermission = await FindPermission(req.user.id);
            if (getPermission && getPermission.canReadFaqs) {
                let foundFaqs = await FAQs.findOne({ where: { id: req.params.id, isActive: true } });
                if (foundFaqs) {
                    return res.status(200).send(foundFaqs);
                } else {
                    return res.status(500).send({ message: "Not Found!" });
                }
            }
            return res.send({
                message: "You don't have permission to perform this action!",
            });
        } catch (err) {
            return res
                .status(500)
                .send({ message: err.message || "Something Went Wrong" });
        }
    };

    updateFaqs = async (req, res) => {
        try {
            let getPermission = await FindPermission(req.user.id);
            if (getPermission && getPermission.canEditFaqs) {
                const terms = _.pick(req.body, ["question", "answer", "isActive"]);
                let foundFaqs = await FAQs.findOne({ where: { id: req.params.id } });
                if (foundFaqs) {
                    let faqs = await FAQs.update(terms, {
                        where: {
                            id: req.params.id,
                        }
                    });
                    return res.send({ message: "Successfully updated" });
                } else {
                    return res.status(500).send({ message: "Not found!" });
                }
            }
            return res.send({
                message: "You don't have permission to perform this action!",
            });
        } catch (err) {
            return res
                .status(500)
                .send({ message: err.message || "Something Went Wrong" });
        }
    };

    deleteFaqs = async (req, res) => {
        try {
            let getPermission = await FindPermission(req.user.id);
            if (getPermission && getPermission.canDeleteFaqs) {
                let foundFaqs = await FAQs.findOne({ where: { id: req.params.id } });
                if (foundFaqs) {
                    let updatedFaqs = await FAQs.update({ isActive: false }, {
                        where: {
                            id: req.params.id
                        }
                    });
                    return res.status(200).send({ message: "Successfully deleted" });
                }
                else {
                    return res.status(500).send({ message: "Not found!" });
                }
            }
            return res.send({
                message: "You don't have permission to perform this action!",
            });
        } catch (err) {
            return res
                .status(500)
                .send({ message: err.message || "Something Went Wrong" });
        }
    };
}
module.exports = FAQS;
