function fAQs(sequelize, Sequelize) {
    const faqs = {
      question: {
        type: Sequelize.STRING
      },
      answer: {
        type: Sequelize.STRING
      },
      isActive: {
          type: Sequelize.BOOLEAN,
          defaultValue: 1
      }      
    };
  
    let FAQS = sequelize.define("faqs", faqs);
  
    return FAQS;
  }
  
  exports.FAQS = fAQs;
  