const moment = require('moment');
const db = require('../../Model');
const ForgetPassword = db.ForgetPassword;
const users = db.users;
const path = require('path');
const winston = require('winston');

module.exports = async function (token, res) {

    ForgetPassword
        .findOne({
            where: {
                token: token
            }
        }).then((result) => {

            if(result) {

                if(result.isExpired == false){
                    return res.sendFile(path.join(__dirname,"../../public/ForgetPassword.html"));
                }else{
                    res.render(path.join(ROOTPATH,"Views/error/500.ejs"), {error: "ERROR: Token Expired"});
                    ForgetPassword
                        .destroy({ where : {id : result.id}})
                        .then(response => winston.info(response))
                        .catch(err => winston.error(err))
                }
            }else{
                res.render(path.join(ROOTPATH,"Views/error/500.ejs"), {error: "ERROR: Token Expired"});
                    ForgetPassword
                        .destroy({ where : {id : result.id}})
                        .then(response => winston.info(response))
                        .catch(err => winston.error(err))
            }
        }).catch(err => winston.error(err))


        // .then((result) => {

        //     if (result && result.dataValues) {

        //         if (result.dataValues.isExpired == false) {

        //             const currentDate = moment(new Date()).format("DD/MM/YYYY");

        //             if (currentDate == result.dataValues.tokenCreatedAt ) {

        //                 const currenttime = moment().format('h:mm a');
        //                 const currentsplit = currenttime.split(':');
        //                 const curentspacesplit = currentsplit[1].split(' ');

        //                 const Endtime = String(result.dataValues.end_time);
        //                 const endtimesplit = Endtime.split(':');
        //                 const endspacesplit = endtimesplit[1].split(' ');

        //                 const currentHour = currentsplit[0];
        //                 const currentMinut = curentspacesplit[0];
        //                 const endtimeHour = endtimesplit[0];
        //                 const endtimeMinut = endspacesplit[0];

        //                 if (currentHour <= endtimeHour) {

        //                     if (currentMinut < endtimeMinut) {
                                
        //                         return res.sendFile(path.join(__dirname,"../../public/ForgetPassword.html"));


        //                     } else {

        //                         // ForgetPassword.update({
        //                         //     isExpired: true
        //                         // }, {
        //                         //     where: {
        //                         //         id: result.dataValues.id
        //                         //     }
        //                         // });

        //                         // return res.sendFile(path.join(__dirname,"../../public/TokenExpired.html"));

        //                         return res.send("sdasdasdasda")
                                
        //                     }

        //                 } else {

        //                     // ForgetPassword.update({
        //                     //     isExpired: true
        //                     // }, {
        //                     //     where: {
        //                     //         id: result.dataValues.id
        //                     //     }
        //                     // });

        //                     // return res.sendFile(path.join(__dirname,"../../public/TokenExpired.html"));

        //                     return res.send("12312312313")


        //                 }

        //             } else {

        //                 // ForgetPassword.update({
        //                 //     isExpired: true
        //                 // }, {
        //                 //     where: {
        //                 //         id: result.dataValues.id
        //                 //     }
        //                 // });
        //                 // return res.sendFile(path.join(__dirname,"../../public/TokenExpired.html"));

        //                 return res.send("sdasdasdassddsaasasdsaddadda")


        //             }

        //         } else {
        //             ForgetPassword.update({
        //                 isExpired: true
        //             }, {
        //                 where: {
        //                     id: result.dataValues.id
        //                 }
        //             });
                   
        //             return res.sendFile(path.join(__dirname,"../../public/TokenExpired.html"));
                   
        //         }
        //     } else {
        //         return res
        //             .status(403)
        //             .send('Token Not Exits');
        //     }

        // })
}