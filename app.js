var PORT = process.env.PORT || 3000;
var methodOverride = require("method-override");
var  express =   require("express");
var app = express();
var bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var LocalMongooseStrategy = require("passport-local-mongoose");
var Blog = require("./models/Blog");
var Comment = require("./models/comment");
var User = require("./models/users");
var seedDB = require("./seeds")
// seedDB(); seed the DB

mongoose.connect("mongodb://localhost:27017/blog_app",{
    useNewUrlParser : true,
    useUnifiedTopology : true
})
.then(()=> console.log("Connected to DB"))
.catch(error => console.log(error.message));

app.use(require("express-session")({
    secret : "Our little secret.",
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
})
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride("_method"));

//============
//Blog Routes
//============
app.get("/",function(req,res){
    res.redirect("/blogs");
});

//Blogs(Landing Page)
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index.ejs",{blogs : blogs, currentUser : req.user});
        }
    });
});

//Create Post
app.get("/blogs/new",isLoggedIn,function(req,res){
    res.render("new.ejs");
});

//Create blog POST Route
app.post("/blogs",function(req,res){
    var title = req.body.title;
    var image = req.body.image;
    var body = req.body.body;
    var author = {
        id : req.user._id,
        name : req.user.name
    }
    var newBlog = {title : title,image : image,body : body,author : author}
    Blog.create(newBlog,function(err,newlyCreatedBlog){
        if(err){
            res.render("new.ejs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});

// Show Blogs Route
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id).populate("comments").exec(function(err,showBlog){
        if(err){
            req.redirect("/blogs");
        }
        else{
            
            res.render("show.ejs",{blog : showBlog});
        }
    });
});
//Edit Blogs Route
app.get("/blogs/:id/edit",checkBlogOwnership,function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        res.render("edit.ejs",{blog : foundBlog});
    });
});
//Update Blogs Route
app.put("/blogs/:id",checkBlogOwnership, function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,UpdatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+ req.params.id);
        }
    });
});
//Delete Blogs Route
app.delete("/blogs/:id",checkBlogOwnership, function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});
//==========
//Comments
//==========
//Show all comments
app.post("/blogs/:id/comments",isLoggedIn,function(req,res) {
    Blog.findById(req.params.id, function(err,blog) {
        if(err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            Comment.create(req.body.comment,function(err, newCmnt){
                if(err) {
                    console.log(err);
                } else {
                    newCmnt.author._id = req.user._id;
                    newCmnt.author.username = req.user.name;
                    newCmnt.save();
                    blog.comments.push(newCmnt);
                    blog.save();
                    console.log(newCmnt);
                    res.redirect("/blogs/"+blog._id);
                }
            });
        }
    })
})
//new Comment
app.get("/blogs/:id/comments/new",isLoggedIn,function(req,res) {
    Blog.findById(req.params.id,function(err, blog) {
        if(err) {
            console.log(err);
        } else {
            res.render("newComment.ejs",{blog : blog});
        }
    })
    
});
//Edit Comment
app.get("/blogs/:id/comments/:comment_id/edit", function(req,res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("editCmnt.ejs",{blog_id : req.params.id, comment : foundComment});
        }
    });
   
})
//Put Comment
app.put("/blogs/:id/comments/:comment_id",function(req,res) {
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err, updatedCmnt){
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/blogs/"+req.params.id);
        }
    })
})
//Delete Comment
app.delete("/blogs/:id/comments/:comment_id", function(req,res){
    
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/blogs/"+ req.params.id);
        }
    })
});

//===============
//AUTHENTICATION
//===============
//Register
app.post("/register",(req,res) => {
    User.register(new User({username : req.body.username, name : req.body.name}),req.body.password,function(err, user){
         if(err) {
             console.log(err);
             return res.render("register.ejs");
         } 
         passport.authenticate("local")(req, res, function(){
             res.redirect("/blogs");
         })
     })
 })
 //Login
 app.post("/login",passport.authenticate("local",{
     successRedirect : "/blogs",
     failureRedirect : "/login"
 }) ,function(req,res) {
   
 })
 //Show Regiter
app.get("/register",(req,res) =>{
    res.render("register.ejs");
})
//Show Login
app.get("/login", (req,res) => {
    res.render("login.ejs");
})
//Logout
app.get("/logout",(req,res) => {
    req.logout();
    res.redirect("/");
})

//==============
//MIDDLEWARE
//==============
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkBlogOwnership(req,res,next) {
    if(req.isAuthenticated()) {
        Blog.findById(req.params.id,function(err,foundBlog){
            if(err){
                res.redirect("back");
            }else{
                if(foundBlog.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
                
            }
        });
    } else {
        res.redirect("back");
    }
}

function checkCommentOwnership(req,res,next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                res.redirect("back");
            }else{
                // console.log(foundComment.author._id);
                // console.log(req.user._id);
                // console.log(foundComment.author.id.equals(req.user._id));
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
                
            }
        });
    } else {
        res.redirect("back");
    }
}

//Port
app.listen(PORT,function(){
    console.log("Blog App is working fine!!");
});