const Joi = require("joi");

function PaymentVoucherModel(sequelize, Sequelize) {
    const paymentvoucher = {
      Date: {
        type: Sequelize.DATE
      },
      Name: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.STRING
        },
      bankOrCash:{
        type: Sequelize.BOOLEAN,
      },
      Reason :{
        type: Sequelize.TEXT
      }
      
    };
  
    let paymentvouchermodel = sequelize.define("paymentvoucher", paymentvoucher);
  
    return paymentvouchermodel;
  }
  

  function ReceiptVoucherModel(sequelize, Sequelize) {
    const Receiptvoucher = {
      Date: {
        type: Sequelize.DATE
      },
      Name: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.STRING
        },
      bankOrCash:{
        type: Sequelize.BOOLEAN,
      },
      Reason :{
        type: Sequelize.TEXT
      }
      
    };
  
    let Receiptvouchermodel = sequelize.define("Receiptvoucher", Receiptvoucher);
  
    return Receiptvouchermodel;
  }



  exports.PaymentVoucherModel = PaymentVoucherModel;
  exports.ReceiptVoucherModel = ReceiptVoucherModel;
  