"use strict";

global.ROOTPATH = __dirname;

const express = require("express");

var moment = require("moment");
const cors = require("cors");
const http = require("http");
const path = require("path");
const app = express();

const { connect_cache } = require("./cache/redis.service");
const handle = require("./Middleware/error");
const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");
const { default_settings } = require("./user_default_settings");


const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

app.use(cors());

app.use("/uploads", express.static("uploads"));

app.use(express.json());

app.use(express.static(__dirname + "views"));
app.use(express.static("public"));

app.set("view engine", "ejs");

const db = require("./Model");
db.sequelize
  .sync({
    force: true, // To create table if exists , so make it false
  })
  .then(async () => {

    console.info(`✔️ Database Connected`);

    connect_cache()
      .then(() => {
        console.info("✔️ Redis Cache Connected");
        /**
         * Listen on provided port, on all network interfaces.
         */
        server.listen(PORT, async function () {
          console.info(`✔️ Server Started (listening on PORT : ${PORT})`);
          if (process.env.NODE_ENV) {
            console.info(`✔️ (${process.env.NODE_ENV}) ENV Loaded`);
          }
          console.info(`⌚`, moment().format("DD-MM-YYYY hh:mm:ss a"));
          default_settings().then(() => {
            console.log(`✔️ Default Data Set`)
          }).catch((e) => {
            if (e) {
              console.error("❗️ Could not execute properly", e);
            }
            console.log(`✔️ Default Data Exists`)
          })
        });
      })
      .catch((err) => {
        console.error(`❌ Server Stopped (listening on PORT : ${PORT})`);
        console.info(`⌚ `, moment().format("DD-MM-YYYY hh:mm:ss a"));
        console.error("❗️ Could not connect to redis database...", err);
        process.exit();
      });
  })
  .catch((err) => {
    console.error(`❌ Server Stopped (listening on PORT : ${PORT})`);
    console.info(`⌚`, moment().format("DD-MM-YYYY hh:mm:ss a"));
    console.error("❗️ Could not connect to database...", err);
    process.exit();
  });

app.use("/api", require("./Startup/api"));
app.use("/cache", require("./cache"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", require("./Startup/web"));

require("./SocketIo/Socket")(server);

// Swagger Routes

// Exceptions Handling
// Calling Error Handling Middleware
app.use(handle);
require("./Startup/exceptions")();

app.use(express.static(path.join(__dirname, "public")));

module.exports = server;
