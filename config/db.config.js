const config = require('config'); 
if (process.env.NODE_ENV == "development") {
    let configurations = {
        HOST: config.get('dbConfig.host'),
        USER: config.get('dbConfig.USER'),
        PASSWORD: config.get('dbConfig.PASSWORD'),
        DB: config.get('dbConfig.DB'),
        dialect: "mysql",
        pool: {
            max: 100,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
    console.log("DEVELOPMENT ENV: ",configurations )
    module.exports = configurations;
} else if (process.env.NODE_ENV == "production") {
    let configurations = {
        HOST: config.get('dbConfig.host'),
        USER: config.get('dbConfig.USER'),
        PASSWORD: config.get('dbConfig.PASSWORD'),
        DB: config.get('dbConfig.DB'),
        dialect: "mysql",
        pool: {
            max: 100,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
    console.log("PRODUCTION ENV: ", configurations )
    module.exports = configurations;
}

// module.exports = {   HOST: '104.154.150.3', 35.200.196.119 localhost   USER:
// 'root',   PASSWORD: '',   DB: 'givees',   dialect: 'mysql',   dialectOptions:
// {     socketPath: `/cloudsql/quiet-bruin-297415:us-central1:givees-dev`,   },
// pool: {     max: 100,     min: 0,     acquire: 30000,     idle: 10000,   },
// };