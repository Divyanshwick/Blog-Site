var mongoose = require("mongoose");
var blogSchema = new mongoose.Schema({
    title   : String,
    image   : String,
    body    : String,
    author : {
        id : {
            type :mongoose.Schema.Types.ObjectId,
            ref : "User"
    }, name : String
},
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
        }
     ],
     likes : [
         {
             type : mongoose.Schema.Types.ObjectId,
             ref : "User"
         }
     ],
    createdAt : {type : Date,default : Date.now}
});

module.exports = mongoose.model("Blog",blogSchema);