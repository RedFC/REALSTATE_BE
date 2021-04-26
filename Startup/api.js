'use strict';
var express = require("express");
var app = express();

// init Routing
app.use("/user", require("../Router/user.router"));

app.use("/auth", require("../Router/auth.router"));
app.use("/role", require("../Router/role.router"));

app.use("/superAdmin", require("../Router/superAdmin.router"));

app.use("/category", require("../Router/category.router"));
app.use("/subcategory", require("../Router/subCategory.router"));

app.use("/terms", require("../Router/termsCondition.router"));
app.use("/about", require("../Router/aboutUs.router"));

app.use("/property", require("../Router/property.router"));
app.use("/branch", require("../Router/branch.router"));





module.exports = app;
