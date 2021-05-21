const Joi = require("joi");

function PaymentVoucherModel(sequelize, Sequelize) {
    const paymentvoucher = {
      date: {
        type: Sequelize.DATE
      },
      name: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.STRING
        },
      bankOrCash:{
        type: Sequelize.BOOLEAN,
      },
      reason :{
        type: Sequelize.TEXT
      }
      
    };
  
    let paymentvouchermodel = sequelize.define("paymentvoucher", paymentvoucher);
  
    return paymentvouchermodel;
  }
  

  function ReceiptVoucherModel(sequelize, Sequelize) {
    const Receiptvoucher = {
      date: {
        type: Sequelize.DATE
      },
      name: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.STRING
        },
      bankOrCash:{
        type: Sequelize.BOOLEAN,
      },
      reason :{
        type: Sequelize.TEXT
      }
      
    };
  
    let Receiptvouchermodel = sequelize.define("Receiptvoucher", Receiptvoucher);
  
    return Receiptvouchermodel;
  }



  exports.PaymentVoucherModel = PaymentVoucherModel;
  exports.ReceiptVoucherModel = ReceiptVoucherModel;
  