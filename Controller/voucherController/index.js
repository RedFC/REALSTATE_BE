const db = require("../../Model");
const _ = require("lodash");
const FindPermission = require("../extras/FindPermission");
const limit = require("../extras/DataLimit/index");

const paymentVoucher = db.PaymentVoucherModel;
const receiptVoucher = db.ReceiptVoucherModel;

const Op = db.Sequelize.Op;

class VoucherController {
    
    createRecepitVoucher = async (req,res) => {

        try {

            let Schema = _.pick(req.body,['date','name','amount','bankOrCash','reason'])

            let createVoucher = await receiptVoucher.create(Schema);

            if(createVoucher){
                res.send({message : "Voucher Created Successfully"});
            }
            
        } catch (error) {
            
            res.status(500).send({error : error.message || "Some Thing Went Wrong"})

        }

    }

    createPaymentVoucher = async (req,res) => {

        try {

            let Schema = _.pick(req.body,['date','name','bankOrCash','reason'])

            let createVoucher = await paymentVoucher.create(Schema);

            if(createVoucher){
                res.send({message : "Voucher Created Successfully"});
            }
            
        } catch (error) {
            
            res.status(500).send({error : error.message || "Some Thing Went Wrong"})

        }

    }

    thesafe = async (req,res) => {

        let getReceiptSum = await db.sequelize.query("select sum(amount) from receiptvouchers");
        let getPaymentSum = await db.sequelize.query("select sum(amount) from paymentvouchers");

        res.send({data : {
            recepitVoucher_total : getReceiptSum[0][0],
            paymentVoucher_total : getPaymentSum[0][0]
        }});

    }

    
}
module.exports = VoucherController;