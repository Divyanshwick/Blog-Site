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

//New Route
app.get("/blogs/new",isLoggedIn,function(req,res){
    res.render("new.ejs");
});
//POST Route
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

// Show Route
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
//Edit Route
app.get("/blogs/:id/edit",checkBlogOwnership,function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        res.render("edit.ejs",{blog : foundBlog});
    });
});
//Update Route
app.put("/blogs/:id",checkBlogOwnership, function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,UpdatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+ req.params.id);
        }
    });
});
//Delete Route
app.delete("/blogs/:id",checkBlogOwnership, function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});