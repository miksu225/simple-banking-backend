const mongoose = require("mongoose");

module.exports.userScheme = new mongoose.Schema({
    id: Number,
    name: String,
    balance: Number,
    password: String
});