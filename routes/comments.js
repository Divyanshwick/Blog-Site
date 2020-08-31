app.get("/blogs/:id/comments/new",isLoggedIn,function(req,res) {
    Blog.findById(req.params.id,function(err, blog) {
        if(err) {
            console.log(err);
        } else {
            res.render("newComment.ejs",{blog : blog});
        }
    })
    
});

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

app.get("/blogs/:id/comments/:comment_id/edit",checkCommentOwnership, function(req,res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("editCmnt.ejs",{blog_id : req.params.id, comment : foundComment});
        }
    });
   
})

app.put("/blogs/:id/comments/:comment_id",function(req,res) {
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err, updatedCmnt){
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/blogs/"+req.params.id);
        }
    })
})

app.delete("/blogs/:id/comments/:comment_id", function(req,res){
    
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/blogs/"+ req.params.id);
        }
    })
});
