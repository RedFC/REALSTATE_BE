const Joi = require("joi");

function PaymentVoucherModel(sequelize, Sequelize) {
    const paymentvoucher = {
<<<<<<< Updated upstream
      Date: {
        type: Sequelize.DATE
      },
      Name: {
=======
      date: {
        type: Sequelize.DATE
      },
      name: {
>>>>>>> Stashed changes
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.STRING
        },
      bankOrCash:{
        type: Sequelize.BOOLEAN,
      },
<<<<<<< Updated upstream
      Reason :{
=======
      reason :{
>>>>>>> Stashed changes
        type: Sequelize.TEXT
      }
      
    };
  
    let paymentvouchermodel = sequelize.define("paymentvoucher", paymentvoucher);
  
    return paymentvouchermodel;
  }
  

  function ReceiptVoucherModel(sequelize, Sequelize) {
    const Receiptvoucher = {
<<<<<<< Updated upstream
      Date: {
        type: Sequelize.DATE
      },
      Name: {
=======
      date: {
        type: Sequelize.DATE
      },
      name: {
>>>>>>> Stashed changes
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.STRING
        },
      bankOrCash:{
        type: Sequelize.BOOLEAN,
      },
<<<<<<< Updated upstream
      Reason :{
=======
      reason :{
>>>>>>> Stashed changes
        type: Sequelize.TEXT
      }
      
    };
  
    let Receiptvouchermodel = sequelize.define("Receiptvoucher", Receiptvoucher);
  
    return Receiptvouchermodel;
  }



  exports.PaymentVoucherModel = PaymentVoucherModel;
  exports.ReceiptVoucherModel = ReceiptVoucherModel;
  