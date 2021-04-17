
const config = require('config');

module.exports = function () {

    if(!config.get('jwtprivatekey')){
        throw new Error("FATAL ERROR : JWT Private Key Not Defined");
    }

  }