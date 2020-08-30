var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
const { model } = require("./Blog");

var userSchema = mongoose.Schema({
    name : String,
    username : String,
    password : String
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchema);