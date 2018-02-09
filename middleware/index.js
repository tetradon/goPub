var Pub = require("../models/pub");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
}

middlewareObj.isAdmin = function(req, res, next) {
 if(req.isAuthenticated()){
        Pub.findById(req.params.id, function(err, foundPub){
           if(err){
               req.flash("error", "Pub was not found");
               res.redirect("back");
           }  else {
            if(req.user.role==="admin") {
                next();
            } else {
                req.flash("error", "You don't have permisson to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "Please Login First!");
        res.redirect("back");
    }
}

middlewareObj.isOwnerOrAdmin = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               req.flash("error", "Comment was not found");
               res.redirect("back");
           }  else {
            if(foundComment.author.id.equals(req.user._id) || req.user.role==="admin") {
                next();
            } else {
                req.flash("error", "You don't have permisson to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "Please Login First!");
        res.redirect("back");
    }
}

module.exports = middlewareObj;