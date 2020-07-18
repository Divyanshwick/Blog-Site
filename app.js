
var PORT = process.env.PORT || 3000;
var express =   require("express"),
app         =   express(),
bodyParser  =   require("body-parser");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

//App Config
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blog_app",{
    useNewUrlParser : true,
    useUnifiedTopology : true
})
.then(()=> console.log("Connected to DB"))
.catch(error => console.log(error.message));

//Model Config
var blogSchema = new mongoose.Schema({
    title   : String,
    image   : String,
    body    : String,
    created : Date
});

//Riutes
app.listen(PORT,function(){
    console.log("Blog App is working fine!!");
});