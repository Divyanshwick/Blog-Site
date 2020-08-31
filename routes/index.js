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
 
 app.post("/login",passport.authenticate("local",{
     successRedirect : "/blogs",
     failureRedirect : "/login"
 }) ,function(req,res) {
   
 })
 
 
 //Adding Comments
 
 //===============
 //AUTHENTICATION
 //===============
 app.get("/register",(req,res) =>{
     res.render("register.ejs");
 })
 app.get("/login", (req,res) => {
     res.render("login.ejs");
 })
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
                 console.log(foundComment.author.id);
                 console.log(req.user._id);
                 console.log(foundComment.author.id.equals(req.user._id));
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