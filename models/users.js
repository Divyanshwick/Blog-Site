var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
// const { model } = require("./Blog");
// const { model } = require("./comment");

var userSchema = mongoose.Schema({
    name : String,
    username : String,
    password : String,
    isAdmin : {type : Boolean,default : false}
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchema);