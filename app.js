
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
    created : {type : Date,default : Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//     title : "Labrador",
//     image : "data:image/jpeg;base64,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",
//     body  : "This is the image of a Labrador puppy,which is super cute",
     
// });

//Routes
app.get("/",function(req,res){
    res.redirect("/blogs");
});


app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index.ejs",{blogs : blogs})
        }
    });
});

//New Route
app.get("/blogs/new",function(req,res){
    res.render("new.ejs");
});
//POST Route
app.post("/blogs",function(req,res){
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new.ejs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});

// Show Route
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,showBlog){
        if(err){
            req.redirect("/blogs");
        }
        else{
            res.render("show.ejs",{blog : showBlog});
        }
    });
});
//Edit Route
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err);
        }else{
            res.render("edit.ejs",{blog : foundBlog});
        }
    });
});
//Update Route
app.put("/blogs/:id",function(req,res){
    res.send("Update Route!!");
});
//Port
app.listen(PORT,function(){
    console.log("Blog App is working fine!!");
});