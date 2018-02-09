var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

 



//root route
router.get("/", function(req, res){
   res.render("landing"); 
});

//show signup form
router.get("/register", function(req, res) {
    res.render("register");
});

//handling signup
router.post("/register", function(req, res) {
   // if(req.body.email)
    User.register(new User({username: req.body.username, email: req.body.email}), req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to GoPub, " + user.username);
            res.redirect("/pubs");
        });
    });
});

//show login form
router.get("/login", function(req, res) {
    res.render("login");
});

//handling login
router.post("/login", passport.authenticate("local",
            {
                successRedirect: "/pubs",
                failureRedirect: "/login",
                failureFlash: true
            }), 
            function(req, res){
                
            }
);

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Goodbye!");
    res.redirect("/pubs");
});

module.exports = router;