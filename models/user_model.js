const mongoose = require("mongoose");
const {userScheme} = require("./user_schema");

module.exports.User = mongoose.model("users", userScheme);