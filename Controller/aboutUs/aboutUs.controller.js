const db = require("../../Model");
const _ = require("lodash");
const FindPermission = require("../extras/FindPermission");
const limit = require("../extras/DataLimit/index");
const About = db.aboutUs;
const Op = db.Sequelize.Op;

class AboutUs {
    create = async (req, res) => {
        try {
            let getPermission = await FindPermission(req.user.id);
            if (getPermission && getPermission.canCreateAboutUs) {
                const about = _.pick(req.body, ["about", "isActive"]);
                let aboutUs = await About.create(about);
                return res.status(200).send(aboutUs);
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

    getSpecificAbout = async (req, res) => {
        try {
            let getPermission = await FindPermission(req.user.id);
            if (getPermission && getPermission.canReadAboutUs) {
                let aboutUs = await About.findOne({ where: { id: req.params.id, isActive: true } });
                if (aboutUs) {
                    return res.status(200).send(aboutUs);
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

    getAllAbout = async (req, res) => {
        try {
            let getPermission = await FindPermission(req.user.id);
            if (getPermission && getPermission.canReadAboutUs) {
                let aboutUs = await About.findAll(
                    {
                        offset:
                            parseInt(req.query.page) * limit.limit
                                ? parseInt(req.query.page) * limit.limit
                                : 0,
                        limit: req.query.page ? limit.limit : 1000000, where: { isActive: true }
                    }
                );
                let countData = {
                    page: parseInt(req.query.page),
                    pages: Math.ceil(aboutUs.length / limit.limit),
                    totalRecords: aboutUs.length
                }
                return res.send({ aboutUs, countData });
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

    getAllAboutsApp = async (req, res) => {

        let getAllAbouts = await About.findAll({
            offset: parseInt(req.query.page) * limit.limit ?
                parseInt(req.query.page) * limit.limit :
                0,
            limit: req.query.page ? limit.limit : 1000000,
            where: {
                isActive: true
            }
        });
        if (!getAllAbouts.length) return res.send({
            message: "Abouts Not Found"
        });
        let countData = {
            page: parseInt(req.query.page),
            pages: Math.ceil(getAllAbouts.length / limit.limit),
            totalRecords: getAllAbouts.length
        }
        return res.send({
            getAllAbouts,
            countData
        });

    }

    updateAbout = async (req, res) => {
        try {
            let getPermission = await FindPermission(req.user.id);
            if (getPermission && getPermission.canEditAboutUs) {
                const about = _.pick(req.body, ["about", "isActive"]);
                let foundAbout = await About.findOne({ where: { id: req.params.id } });
                if (foundAbout) {
                    let aboutUs = await About.update(about, {
                        where: {
                            id: req.params.id,
                        }
                    });
                    return res.status(200).send({ message: "Successfully updated" });
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

    deleteAbout = async (req, res) => {
        try {
            let getPermission = await FindPermission(req.user.id);
            if (getPermission && getPermission.canDeleteAboutUs) {
                let foundAbout = await About.findOne({ where: { id: req.params.id } });
                if (foundAbout) {
                    let aboutUs = await About.update({ isActive: false }, {
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
module.exports = AboutUs;
